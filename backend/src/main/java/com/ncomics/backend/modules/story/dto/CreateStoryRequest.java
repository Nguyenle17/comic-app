package com.ncomics.backend.modules.story.dto;

import com.ncomics.backend.modules.story.enums.StoryType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateStoryRequest(
        @NotBlank
        @Size(max = 255)
        String title,

        @NotBlank
        @Size(max = 255)
        String slug,

        @Size(max = 5000)
        String description,

        @NotNull
        StoryType storyType
) {
}
