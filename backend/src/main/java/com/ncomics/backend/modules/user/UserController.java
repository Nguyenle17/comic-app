package com.ncomics.backend.modules.user;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ncomics.backend.modules.auth.implement.CustomUserDetails;
import com.ncomics.backend.modules.user.dto.UserProfileResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public UserProfileResponse getProfile(@AuthenticationPrincipal CustomUserDetails user) {
        return userService.getProfile(user.getId());
    }

    @PostMapping("/me/become-author")
    public UserProfileResponse becomeAuthor(@AuthenticationPrincipal CustomUserDetails user) {
        return userService.becomeAuthor(user.getUser().getEmail());
    }
}
