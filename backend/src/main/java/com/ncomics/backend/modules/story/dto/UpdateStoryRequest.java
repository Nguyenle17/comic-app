package com.ncomics.backend.modules.story.dto;

import com.ncomics.backend.modules.story.enums.StoryType;

import jakarta.validation.constraints.Size;

public record UpdateStoryRequest(
        @Size(max = 255)
        String title,

        @Size(max = 255)
        String slug,

        @Size(max = 5000)
        String description,

        StoryType storyType
) {
}
