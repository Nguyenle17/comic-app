package com.ncomics.backend.modules.auth.dto;

public record AuthResult(
        AuthResponse response,
        String refreshToken
) {
}
