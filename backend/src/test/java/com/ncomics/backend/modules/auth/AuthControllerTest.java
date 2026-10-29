package com.ncomics.backend.modules.auth;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.LocalDateTime;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletResponse;

import com.ncomics.backend.modules.auth.dto.AuthResponse;
import com.ncomics.backend.modules.auth.dto.AuthResult;
import com.ncomics.backend.modules.auth.dto.LoginRequest;
import com.ncomics.backend.modules.auth.dto.UserResponse;

class AuthControllerTest {

    private static final long REFRESH_TOKEN_MS = 604_800_000L;

    private AuthService authService;
    private AuthController authController;

    @BeforeEach
    void setUp() {
        authService = mock(AuthService.class);
        authController = new AuthController(
                authService,
                "refresh_token",
                REFRESH_TOKEN_MS,
                false,
                "Lax"
        );
    }

    @Test
    void login_shouldSetPersistentCookie_whenRememberIsTrue() {
        when(authService.login(any())).thenReturn(authResult(true));
        MockHttpServletResponse response = new MockHttpServletResponse();

        authController.login(
                new LoginRequest("john@example.com", "Password123", true),
                response
        );

        String cookie = response.getHeader("Set-Cookie");
        assertTrue(cookie.contains("refresh_token=refreshToken"));
        assertTrue(cookie.contains("HttpOnly"));
        assertTrue(cookie.contains("Max-Age=604800"));
    }

    @Test
    void login_shouldSetSessionCookie_whenRememberIsFalse() {
        when(authService.login(any())).thenReturn(authResult(false));
        MockHttpServletResponse response = new MockHttpServletResponse();

        authController.login(
                new LoginRequest("john@example.com", "Password123", false),
                response
        );

        String cookie = response.getHeader("Set-Cookie");
        assertTrue(cookie.contains("refresh_token=refreshToken"));
        assertFalse(cookie.contains("Max-Age"));
    }

    @Test
    void logout_shouldRevokeTokenAndClearCookie() {
        MockHttpServletResponse response = new MockHttpServletResponse();

        authController.logout("refreshToken", response);

        verify(authService).logout("refreshToken");
        String cookie = response.getHeader("Set-Cookie");
        assertTrue(cookie.contains("refresh_token="));
        assertTrue(cookie.contains("Max-Age=0"));
    }

    private AuthResult authResult(boolean persistent) {
        UserResponse user = new UserResponse(
                1L,
                "john",
                "john@example.com",
                "John",
                null,
                "reader",
                100,
                null,
                LocalDateTime.now()
        );
        return new AuthResult(
                new AuthResponse(user, "accessToken"),
                "refreshToken",
                persistent
        );
    }
}
