package com.ncomics.backend.modules.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;

import com.ncomics.backend.modules.auth.security.JwtService;

import io.jsonwebtoken.JwtException;

class JwtServiceTest {

    private JwtService jwtService;
    private UserDetails userDetails;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(
                "local-development-secret-at-least-32-characters",
                900_000L,
                604_800_000L
        );

        userDetails = User.withUsername("john@example.com")
                .password("hashed-password")
                .roles("READER")
                .build();
    }

    @Test
    void generateAccessToken_shouldContainUsername() {
        String token =
                jwtService.generateAccessToken(userDetails);

        String username =
                jwtService.extractUsername(token);

        assertEquals(
                "john@example.com",
                username
        );
    }

    @Test
    void generateAccessToken_shouldBeValid() {
        String token =
                jwtService.generateAccessToken(userDetails);

        boolean valid =
                jwtService.isTokenValid(token, userDetails);

        assertTrue(valid);
    }

    @Test
    void generateRefreshToken_shouldNotBeValidAsAccessToken() {
        String refreshToken =
                jwtService.generateRefreshToken(userDetails);

        boolean valid =
                jwtService.isTokenValid(
                        refreshToken,
                        userDetails
                );

        assertFalse(valid);
    }

    @Test
    void token_shouldBeInvalidForAnotherUser() {
        String token =
                jwtService.generateAccessToken(userDetails);

        UserDetails anotherUser =
                User.withUsername("another@example.com")
                        .password("hashed-password")
                        .roles("READER")
                        .build();

        boolean valid =
                jwtService.isTokenValid(token, anotherUser);

        assertFalse(valid);
    }

    @Test
    void tokenWithInvalidSignature_shouldBeRejected() {
        JwtService anotherJwtService = new JwtService(
                "another-secret-key-at-least-32-characters",
                900_000L,
                604_800_000L
        );

        String token =
                anotherJwtService.generateAccessToken(userDetails);

        assertThrows(
                JwtException.class,
                () -> jwtService.extractUsername(token)
        );
    }
}