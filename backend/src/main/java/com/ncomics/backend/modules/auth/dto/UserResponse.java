package com.ncomics.backend.modules.auth.dto;

import java.time.LocalDateTime;

public record UserResponse(
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
}