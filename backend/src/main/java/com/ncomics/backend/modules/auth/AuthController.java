package com.ncomics.backend.modules.auth;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.web.bind.annotation.CookieValue;

import java.time.Duration;

import jakarta.servlet.http.HttpServletResponse;
import com.ncomics.backend.modules.auth.dto.AuthResponse;
import com.ncomics.backend.modules.auth.dto.AuthResult;
import com.ncomics.backend.modules.auth.dto.LoginRequest;
import com.ncomics.backend.modules.auth.dto.RegisterRequest;
import jakarta.validation.Valid;

@RestController 
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;
    private final String refreshCookieName;
    private final long refreshTokenMs;
    private final boolean secureCookie;
    private final String sameSite;

    public AuthController(
            AuthService authService,
            @Value("${cookie.refresh-name:refresh_token}") String refreshCookieName,
            @Value("${jwt.refresh-token-ms}") long refreshTokenMs,
            @Value("${cookie.secure:false}") boolean secureCookie,
            @Value("${cookie.same-site:Lax}") String sameSite
    ) {
        this.authService = authService;
        this.refreshCookieName = refreshCookieName;
        this.refreshTokenMs = refreshTokenMs;
        this.secureCookie = secureCookie;
        this.sameSite = sameSite;
    }
    
    @PostMapping("/register")
    public AuthResponse register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response
    ) {
        return writeAuthResult(authService.register(request), response);
    }

    @PostMapping ("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        return writeAuthResult(authService.login(request), response);
    }

    @PostMapping("/refresh")
    public AuthResponse refresh(
            @CookieValue(
                    name = "${cookie.refresh-name:refresh_token}",
                    required = false
            ) String refreshToken,
            HttpServletResponse response
    ) {
        return writeAuthResult(
                authService.refresh(refreshToken),
                response
        );
    }

    @PostMapping("/logout")
    public void logout(HttpServletResponse response) {
        response.addHeader(
                "Set-Cookie",
                createRefreshCookie("", Duration.ZERO).toString()
        );
    }

    private AuthResponse writeAuthResult(
            AuthResult result,
            HttpServletResponse response
    ) {
        response.addHeader(
                "Set-Cookie",
                createRefreshCookie(
                        result.refreshToken(),
                        Duration.ofMillis(refreshTokenMs)
                ).toString()
        );
        return result.response();
    }

    private ResponseCookie createRefreshCookie(
            String value,
            Duration maxAge
    ) {
        return ResponseCookie.from(refreshCookieName, value)
                .httpOnly(true)
                .secure(secureCookie)
                .path("/")
                .sameSite(sameSite)
                .maxAge(maxAge)
                .build();
    }
}
