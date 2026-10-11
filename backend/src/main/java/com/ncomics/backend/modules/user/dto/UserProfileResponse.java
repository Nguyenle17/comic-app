package com.ncomics.backend.modules.user.dto;

import java.time.LocalDateTime;

import com.ncomics.backend.modules.user.User;

public record UserProfileResponse(
        Long id,
        String username,
        String email,
        String displayName,
        String avatarUrl,
        String role,
        Integer coinBalance,
        String bio,
        LocalDateTime createdAt
) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getDisplayName(),
                user.getAvatarUrl(),
                user.getRole().name().toLowerCase(),
                user.getCoinBalance(),
                user.getBio(),
                user.getCreatedAt()
        );
    }
}
