package com.ncomics.backend.modules.story;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ncomics.backend.modules.auth.implement.CustomUserDetails;
import com.ncomics.backend.modules.story.dto.request.CreateStoryRequest;
import com.ncomics.backend.modules.story.dto.response.StoryResponse;
import com.ncomics.backend.modules.story.dto.request.UpdateStoryRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/stories")
public class StoryController {

    private final StoryService storyService;

    public StoryController(StoryService storyService) {
        this.storyService = storyService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('AUTHOR', 'ADMIN')")
    public StoryResponse createStory(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody CreateStoryRequest request
    ) {
        return storyService.createStory(user.getUser(), request);
    }

    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('AUTHOR', 'ADMIN')")
    public List<StoryResponse> getMyStories(
            @AuthenticationPrincipal CustomUserDetails user
    ) {
        return storyService.getStoriesByAuthor(user.getId());
    }

    @GetMapping("/{storyId}")
    public StoryResponse getStory(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long storyId
    ) {
        return storyService.getStory(storyId, user == null ? null : user.getUser());
    }

    @PatchMapping("/{storyId}")
    @PreAuthorize("hasAnyRole('AUTHOR', 'ADMIN')")
    public StoryResponse updateStory(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long storyId,
            @Valid @RequestBody UpdateStoryRequest request
    ) {
        return storyService.updateStory(user.getUser(), storyId, request);
    }

    @PostMapping("/{storyId}/cover")
    @PreAuthorize("hasAnyRole('AUTHOR', 'ADMIN')")
    public StoryResponse uploadCover(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long storyId,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        return storyService.uploadCover(user.getUser(), storyId, file);
    }

    @DeleteMapping("/{storyId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @PreAuthorize("hasAnyRole('AUTHOR', 'ADMIN')")
    public void deleteStory(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long storyId
    ) {
        storyService.deleteStory(user.getUser(), storyId);
    }
}
