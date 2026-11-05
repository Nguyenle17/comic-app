package com.ncomics.backend.modules.story;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.ncomics.backend.common.exception.DuplicateResourceException;
import com.ncomics.backend.modules.category.CategoryRepository;
import com.ncomics.backend.modules.category.entity.Category;
import com.ncomics.backend.modules.story.dto.request.CreateStoryRequest;
import com.ncomics.backend.modules.story.dto.response.StoryResponse;
import com.ncomics.backend.modules.story.dto.request.UpdateStoryRequest;
import com.ncomics.backend.modules.story.entity.Story;
import com.ncomics.backend.modules.story.enums.Status;
import com.ncomics.backend.modules.user.entity.User;
import com.ncomics.backend.modules.user.enums.Role;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class StoryService {

    private static final Set<String> IMAGE_TYPES = Set.of(
            "image/png", "image/jpeg", "image/webp"
    );

    private final StoryRepository storyRepository;
    private final CategoryRepository categoryRepository;
    private final String uploadDir;

    public StoryService(
            StoryRepository storyRepository,
            CategoryRepository categoryRepository,
            @Value("${upload.dir:./uploads}") String uploadDir
    ) {
        this.storyRepository = storyRepository;
        this.categoryRepository = categoryRepository;
        this.uploadDir = uploadDir;
    }

    @Transactional
    public StoryResponse createStory(User author, CreateStoryRequest request) {
        if (storyRepository.existsBySlug(request.slug())) {
            throw new DuplicateResourceException("Slug is already taken");
        }

        Story story = Story.builder()
                .title(request.title())
                .slug(request.slug())
                .description(request.description())
                .storyType(request.storyType())
                .status(Status.UNCOMPLETED)
                .visible(request.visible() == null || request.visible())
                .categories(resolveCategories(request.categoryIds()))
                .author(author)
                .build();

        return StoryResponse.from(storyRepository.save(story));
    }

    @Transactional(readOnly = true)
    public StoryResponse getStory(Long storyId, User viewer) {
        Story story = findStory(storyId);

        if (!story.isVisible() && !canManage(story, viewer)) {
            throw new IllegalArgumentException("Story not found");
        }

        return StoryResponse.from(story);
    }

    @Transactional(readOnly = true)
    public List<StoryResponse> getStoriesByAuthor(Long authorId) {
        return storyRepository.findByAuthorIdOrderByUpdatedAtDesc(authorId)
                .stream()
                .map(StoryResponse::from)
                .toList();
    }

    @Transactional
    public StoryResponse updateStory(
            User user,
            Long storyId,
            UpdateStoryRequest request
    ) {
        Story story = findOwnedStory(user, storyId);

        if (request.slug() != null
                && !request.slug().equals(story.getSlug())
                && storyRepository.existsBySlug(request.slug())) {
            throw new DuplicateResourceException("Slug is already taken");
        }

        if (request.title() != null) {
            story.setTitle(request.title());
        }
        if (request.slug() != null) {
            story.setSlug(request.slug());
        }
        if (request.description() != null) {
            story.setDescription(request.description());
        }
        if (request.storyType() != null) {
            story.setStoryType(request.storyType());
        }
        if (request.visible() != null) {
            story.setVisible(request.visible());
        }
        if (request.categoryIds() != null) {
            story.getCategories().clear();
            storyRepository.saveAndFlush(story);
            story.getCategories().addAll(resolveCategories(request.categoryIds()));
        }

        return StoryResponse.from(storyRepository.save(story));
    }

    @Transactional
    public StoryResponse uploadCover(
            User user,
            Long storyId,
            MultipartFile file
    ) throws IOException {
        Story story = findOwnedStory(user, storyId);

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cover image is required");
        }
        if (!IMAGE_TYPES.contains(file.getContentType())) {
            throw new IllegalArgumentException(
                    "Cover must be a PNG, JPEG or WebP image"
            );
        }

        String fileName = UUID.randomUUID() + "." + getFileExtension(file.getOriginalFilename());
        Path filePath = Path.of(uploadDir, fileName);
        Files.createDirectories(filePath.getParent());
        file.transferTo(filePath.toAbsolutePath());

        String previousCoverUrl = story.getCoverImageUrl();
        story.setCoverImageUrl("/uploads/" + fileName);
        Story saved = storyRepository.saveAndFlush(story);
        deleteCoverImage(previousCoverUrl);

        return StoryResponse.from(saved);
    }

    @Transactional
    public void deleteStory(User user, Long storyId) {
        Story story = findOwnedStory(user, storyId);
        String coverImageUrl = story.getCoverImageUrl();

        storyRepository.delete(story);
        storyRepository.flush();

        deleteCoverImage(coverImageUrl);
    }

    private void deleteCoverImage(String coverImageUrl) {
        if (coverImageUrl == null || coverImageUrl.isBlank()) {
            return;
        }

        String filename = coverImageUrl.substring(
                coverImageUrl.lastIndexOf("/") + 1
        );
        if (filename.isBlank()) {
            return;
        }

        Path root = Path.of(uploadDir).toAbsolutePath().normalize();
        Path filePath = root.resolve(filename).normalize();

        if (!filePath.startsWith(root)) {
            log.warn("Skipping cover deletion outside upload dir: {}", coverImageUrl);
            return;
        }

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("Failed to delete cover image {}", filePath, e);
        }
    }

    private Story findStory(Long storyId) {
        return storyRepository.findById(storyId)
                .orElseThrow(() -> new IllegalArgumentException("Story not found"));
    }

    private Set<Category> resolveCategories(List<Long> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            return new LinkedHashSet<>();
        }

        Set<Long> uniqueIds = new LinkedHashSet<>(categoryIds);
        List<Category> categories = categoryRepository.findAllById(uniqueIds);

        if (categories.size() != uniqueIds.size()) {
            throw new IllegalArgumentException("Category not found");
        }

        return new LinkedHashSet<>(categories);
    }

    private Story findOwnedStory(User user, Long storyId) {
        Story story = findStory(storyId);

        if (!canManage(story, user)) {
            throw new AccessDeniedException("You do not own this story");
        }

        return story;
    }

    private boolean canManage(Story story, User user) {
        return user != null
                && (story.getAuthor().getId().equals(user.getId())
                || user.getRole() == Role.ADMIN);
    }

    private String getFileExtension(String fileName) {
        if (fileName == null) {
            return "jpg";
        }

        int dot = fileName.lastIndexOf('.');
        return dot >= 0
                ? fileName.substring(dot + 1).toLowerCase(Locale.ROOT)
                : "jpg";
    }
}
