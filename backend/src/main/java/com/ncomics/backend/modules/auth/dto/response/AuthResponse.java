package com.ncomics.backend.modules.auth.dto.response;

public record AuthResponse(
        UserResponse user,
        String accessToken
) {
}
