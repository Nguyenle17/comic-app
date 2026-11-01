package com.ncomics.backend.modules.story.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

import com.ncomics.backend.modules.category.dto.CategoryResponse;
import com.ncomics.backend.modules.story.entity.Story;

public record StoryResponse(
        Long id,
        String title,
        String slug,
        String description,
        String coverImageUrl,
        String storyType,
        String status,
        boolean visible,
        List<CategoryResponse> categories,
        String authorEmail,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
    public static StoryResponse from(Story story) {
        return new StoryResponse(
                story.getId(),
                story.getTitle(),
                story.getSlug(),
                story.getDescription(),
                story.getCoverImageUrl(),
                story.getStoryType().name().toLowerCase(Locale.ROOT),
                story.getStatus().name().toLowerCase(Locale.ROOT),
                story.isVisible(),
                story.getCategories().stream()
                        .map(CategoryResponse::from)
                        .toList(),
                story.getAuthor().getEmail(),
                story.getCreatedAt(),
                story.getUpdatedAt()
        );
    }
}
