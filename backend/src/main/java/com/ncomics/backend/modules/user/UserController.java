package com.ncomics.backend.modules.user;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ncomics.backend.modules.user.dto.UserProfileResponse;

import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/me/become-author")
    public UserProfileResponse becomeAuthor(
            Authentication authentication
    ) {
        return userService.becomeAuthor(authentication.getName());
    }
}
