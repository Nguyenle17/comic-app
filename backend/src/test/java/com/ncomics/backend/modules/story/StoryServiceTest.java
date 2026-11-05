package com.ncomics.backend.modules.story;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import com.ncomics.backend.common.exception.DuplicateResourceException;
import com.ncomics.backend.modules.category.CategoryRepository;
import com.ncomics.backend.modules.category.entity.Category;
import com.ncomics.backend.modules.story.dto.request.CreateStoryRequest;
import com.ncomics.backend.modules.story.dto.response.StoryResponse;
import com.ncomics.backend.modules.story.dto.request.UpdateStoryRequest;
import com.ncomics.backend.modules.story.entity.Story;
import com.ncomics.backend.modules.story.enums.StoryType;
import com.ncomics.backend.modules.user.entity.User;
import com.ncomics.backend.modules.user.enums.Role;

@ExtendWith(MockitoExtension.class)
class StoryServiceTest {

    @Mock
    private StoryRepository storyRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @TempDir
    private Path tempDir;

    private StoryService storyService() {
        return new StoryService(storyRepository, categoryRepository, "uploads");
    }

    private User user(Long id, Role role) {
        return User.builder()
                .id(id)
                .email("author" + id + "@example.com")
                .role(role)
                .build();
    }

    @Test
    void createStoryReturnsSavedStory() {
        when(storyRepository.save(any(Story.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        StoryResponse response = storyService().createStory(
                user(1L, Role.AUTHOR),
                new CreateStoryRequest("Title", "title", "Desc", StoryType.TEXT, null, null)
        );

        assertEquals("Title", response.title());
        assertEquals("title", response.slug());
        assertEquals("author1@example.com", response.authorEmail());
    }

    @Test
    void createStoryRejectsDuplicateSlug() {
        when(storyRepository.existsBySlug("title")).thenReturn(true);

        assertThrows(
                DuplicateResourceException.class,
                () -> storyService().createStory(
                        user(1L, Role.AUTHOR),
                        new CreateStoryRequest("Title", "title", null, StoryType.TEXT, null, null)
                )
        );
    }

    @Test
    void updateStoryRejectsNonOwner() {
        Story story = Story.builder()
                .id(10L)
                .slug("title")
                .author(user(1L, Role.AUTHOR))
                .build();
        when(storyRepository.findById(10L)).thenReturn(Optional.of(story));

        assertThrows(
                AccessDeniedException.class,
                () -> storyService().updateStory(
                        user(2L, Role.READER),
                        10L,
                        new UpdateStoryRequest("New", null, null, null, null, null)
                )
        );
    }

    @Test
    void getStoryHidesInvisibleStoryFromAnonymous() {
        Story story = Story.builder()
                .id(10L)
                .slug("title")
                .visible(false)
                .author(user(1L, Role.AUTHOR))
                .build();
        when(storyRepository.findById(10L)).thenReturn(Optional.of(story));

        assertThrows(
                IllegalArgumentException.class,
                () -> storyService().getStory(10L, null)
        );
    }

    @Test
    void getStoryAllowsOwnerToSeeInvisibleStory() {
        Story story = Story.builder()
                .id(10L)
                .slug("title")
                .visible(false)
                .author(user(1L, Role.AUTHOR))
                .build();
        when(storyRepository.findById(10L)).thenReturn(Optional.of(story));

        StoryResponse response = storyService().getStory(10L, story.getAuthor());

        assertEquals(false, response.visible());
    }

    @Test
    void updateStoryTogglesVisibility() {
        Story story = Story.builder()
                .id(10L)
                .slug("title")
                .author(user(1L, Role.AUTHOR))
                .build();
        when(storyRepository.findById(10L)).thenReturn(Optional.of(story));
        when(storyRepository.save(any(Story.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        StoryResponse response = storyService().updateStory(
                story.getAuthor(),
                10L,
                new UpdateStoryRequest(null, null, null, null, false, null)
        );

        assertEquals(false, response.visible());
    }

    @Test
    void createStoryAssignsCategories() {
        Category category = Category.builder()
                .id(1L)
                .name("Hành động")
                .slug("hanh-dong")
                .build();
        when(categoryRepository.findAllById(any())).thenReturn(List.of(category));
        when(storyRepository.save(any(Story.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        StoryResponse response = storyService().createStory(
                user(1L, Role.AUTHOR),
                new CreateStoryRequest(
                        "Title", "title", null, StoryType.TEXT, null, List.of(1L)
                )
        );

        assertEquals(1, response.categories().size());
        assertEquals("hanh-dong", response.categories().get(0).slug());
    }

    @Test
    void deleteStoryDeletesCoverFile() throws IOException {
        Path cover = Files.writeString(tempDir.resolve("cover.jpg"), "image");
        Story story = Story.builder()
                .id(10L)
                .slug("title")
                .coverImageUrl("/uploads/cover.jpg")
                .author(user(1L, Role.AUTHOR))
                .build();
        when(storyRepository.findById(10L)).thenReturn(Optional.of(story));

        new StoryService(storyRepository, categoryRepository, tempDir.toString())
                .deleteStory(story.getAuthor(), 10L);

        verify(storyRepository).delete(story);
        assertFalse(Files.exists(cover));
    }

    @Test
    void deleteStoryKeepsCoverWhenDatabaseDeleteFails() throws IOException {
        Path cover = Files.writeString(tempDir.resolve("cover.jpg"), "image");
        Story story = Story.builder()
                .id(10L)
                .slug("title")
                .coverImageUrl("/uploads/cover.jpg")
                .author(user(1L, Role.AUTHOR))
                .build();
        when(storyRepository.findById(10L)).thenReturn(Optional.of(story));
        doThrow(new IllegalStateException("constraint"))
                .when(storyRepository)
                .delete(story);

        assertThrows(
                IllegalStateException.class,
                () -> new StoryService(storyRepository, categoryRepository, tempDir.toString())
                        .deleteStory(story.getAuthor(), 10L)
        );
        assertTrue(Files.exists(cover));
    }

    @Test
    void deleteStoryWithoutCoverStillDeletes() {
        Story story = Story.builder()
                .id(10L)
                .slug("title")
                .author(user(1L, Role.AUTHOR))
                .build();
        when(storyRepository.findById(10L)).thenReturn(Optional.of(story));

        storyService().deleteStory(story.getAuthor(), 10L);

        verify(storyRepository).delete(story);
    }

    @Test
    void createStoryRejectsUnknownCategory() {
        when(categoryRepository.findAllById(any())).thenReturn(List.of());

        assertThrows(
                IllegalArgumentException.class,
                () -> storyService().createStory(
                        user(1L, Role.AUTHOR),
                        new CreateStoryRequest(
                                "Title", "title", null, StoryType.TEXT, null, List.of(99L)
                        )
                )
        );
    }
}
