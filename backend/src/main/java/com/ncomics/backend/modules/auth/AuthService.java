package com.ncomics.backend.modules.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Locale;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ncomics.backend.common.exception.DuplicateResourceException;
import com.ncomics.backend.common.exception.InvalidTokenException;
import com.ncomics.backend.modules.auth.dto.response.AuthResponse;
import com.ncomics.backend.modules.auth.dto.AuthResult;
import com.ncomics.backend.modules.auth.dto.request.LoginRequest;
import com.ncomics.backend.modules.auth.dto.request.RegisterRequest;
import com.ncomics.backend.modules.auth.dto.response.UserResponse;
import com.ncomics.backend.modules.auth.entity.RefreshToken;
import com.ncomics.backend.modules.auth.security.JwtService;
import com.ncomics.backend.modules.user.UserRepository;
import com.ncomics.backend.modules.user.entity.User;
import com.ncomics.backend.modules.user.enums.Role;
import com.ncomics.backend.modules.user.enums.UserStatus;

import io.jsonwebtoken.JwtException;

@Service
public class AuthService {

    private static final String INVALID_REFRESH_TOKEN = "Refresh token is invalid";

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       RefreshTokenRepository refreshTokenRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public AuthResult register(RegisterRequest request) {
        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email is already registered");
        }
        if (userRepository.existsByUsername(request.username())) {
            throw new DuplicateResourceException("Username is already taken");
        }

        User user = User.builder()
                .username(request.username())
                .email(email)
                .passwordHash(passwordEncoder.encode(request.password()))
                .displayName(request.displayName())
                .role(Role.READER)
                .status(UserStatus.ACTIVE)
                .coinBalance(100)
                .build();

        userRepository.save(user);
        return createAuthResult(user, true);
    }

    @Transactional
    public AuthResult login(LoginRequest request) {
        String email = normalizeEmail(request.email());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.password()
                )
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Invalid credentials"));

        boolean persistent = request.remember() == null || request.remember();
        return createAuthResult(user, persistent);
    }

    @Transactional
    public AuthResult refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new InvalidTokenException("Refresh token is missing");
        }

        try {
            String email = jwtService.extractUsername(refreshToken);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new InvalidTokenException(INVALID_REFRESH_TOKEN));

            if (user.getStatus() != UserStatus.ACTIVE) {
                throw new InvalidTokenException("Account is not active");
            }

            var userDetails = toUserDetails(user);
            if (!jwtService.isRefreshTokenValid(refreshToken, userDetails)) {
                throw new InvalidTokenException(INVALID_REFRESH_TOKEN);
            }

            RefreshToken storedToken = refreshTokenRepository
                    .findByTokenHash(hashToken(refreshToken))
                    .orElseThrow(() -> new InvalidTokenException(INVALID_REFRESH_TOKEN));

            if (storedToken.isRevoked()) {
                throw new InvalidTokenException("Refresh token has been revoked");
            }
            if (!storedToken.getExpiresAt().isAfter(Instant.now())) {
                throw new InvalidTokenException("Refresh token has expired");
            }

            storedToken.setRevoked(true);
            refreshTokenRepository.save(storedToken);

            return createAuthResult(user, storedToken.isPersistent());
        } catch (JwtException | IllegalArgumentException exception) {
            throw new InvalidTokenException(INVALID_REFRESH_TOKEN);
        }
    }

    @Transactional
    public void logout(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            return;
        }

        refreshTokenRepository.findByTokenHash(hashToken(refreshToken))
                .ifPresent(token -> {
                    if (!token.isRevoked()) {
                        token.setRevoked(true);
                        refreshTokenRepository.save(token);
                    }
                });
    }

    private AuthResult createAuthResult(User user, boolean persistent) {
        var userDetails = toUserDetails(user);

        AuthResponse response = new AuthResponse(
                new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getDisplayName(),
                        user.getAvatarUrl(),
                        user.getRole().name().toLowerCase(Locale.ROOT),
                        user.getCoinBalance(),
                        user.getBio(),
                        user.getCreatedAt()
                ),
                jwtService.generateAccessToken(userDetails)
        );

        String refreshToken = jwtService.generateRefreshToken(userDetails);
        storeRefreshToken(user, refreshToken, persistent);

        return new AuthResult(response, refreshToken, persistent);
    }

    private void storeRefreshToken(User user, String token, boolean persistent) {
        refreshTokenRepository.save(RefreshToken.builder()
                .tokenHash(hashToken(token))
                .user(user)
                .expiresAt(jwtService.extractExpiration(token).toInstant())
                .revoked(false)
                .persistent(persistent)
                .build());
    }

    private org.springframework.security.core.userdetails.UserDetails toUserDetails(
            User user
    ) {
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getRole().name())
                .build();
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is not available", exception);
        }
    }
}
