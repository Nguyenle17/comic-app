package com.ncomics.backend.modules.auth.dto;

import com.ncomics.backend.modules.auth.dto.response.AuthResponse;

public record AuthResult(
        AuthResponse response,
        String refreshToken,
        boolean persistent
) {
}
