package com.ncomics.backend.modules.story.dto;

import java.time.LocalDateTime;

import com.ncomics.backend.modules.story.Story;

public record StoryResponse(
        Long id,
        String title,
        String slug,
        String description,
        String coverImageUrl,
        String storyType,
        String status,
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
                story.getStoryType().name().toLowerCase(),
                story.getStatus().name().toLowerCase(),
                story.getAuthor(),
                story.getCreatedAt(),
                story.getUpdatedAt()
        );
    }
}
