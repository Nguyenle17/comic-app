package com.ncomics.backend.modules.story.dto.request;

import com.ncomics.backend.modules.story.enums.StoryType;

import java.util.List;

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
        StoryType storyType,

        Boolean visible,

        List<Long> categoryIds
) {
}
