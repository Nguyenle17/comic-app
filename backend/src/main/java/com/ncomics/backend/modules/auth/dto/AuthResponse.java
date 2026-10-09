package com.ncomics.backend.modules.auth.dto;

public record AuthResponse(
        UserResponse user,
        String accessToken
) {
}
