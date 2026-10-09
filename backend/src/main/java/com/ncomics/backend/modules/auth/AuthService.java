package com.ncomics.backend.modules.auth;

import java.util.Locale;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ncomics.backend.modules.auth.dto.AuthResponse;
import com.ncomics.backend.modules.auth.dto.AuthResult;
import com.ncomics.backend.modules.auth.dto.LoginRequest;
import com.ncomics.backend.modules.auth.dto.RegisterRequest;
import com.ncomics.backend.modules.auth.dto.UserResponse;
import com.ncomics.backend.modules.auth.security.JwtService;
import com.ncomics.backend.common.exception.InvalidTokenException;
import com.ncomics.backend.modules.user.User;
import com.ncomics.backend.modules.user.UserRepository;
import com.ncomics.backend.modules.user.enums.Role;
import com.ncomics.backend.modules.user.enums.UserStatus;
import com.ncomics.backend.common.exception.DuplicateResourceException;

import io.jsonwebtoken.JwtException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
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
            .passwordHash(
                    passwordEncoder.encode(request.password())
            )
            .displayName(request.displayName())
            .avatarUrl(request.avatarUrl())
            .bio(request.bio())
            .role(Role.READER)
            .status(UserStatus.ACTIVE)
            .coinBalance(100)
            .build();
        userRepository.save(user);
        return createAuthResult(user);
    }

    @Transactional(readOnly = true)
    public AuthResult login(LoginRequest request) {
        String email = normalizeEmail(request.email());

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.password()
                )
        );

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        return createAuthResult(user);
    }

    @Transactional(readOnly = true)
    public AuthResult refresh(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new InvalidTokenException("Refresh token is missing");
        }

        try {
            String email = jwtService.extractUsername(refreshToken);
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() ->
                            new InvalidTokenException("Refresh token is invalid"));

            if (user.getStatus() != UserStatus.ACTIVE) {
                throw new InvalidTokenException("Account is not active");
            }

            var userDetails = toUserDetails(user);
            if (!jwtService.isRefreshTokenValid(refreshToken, userDetails)) {
                throw new InvalidTokenException("Refresh token is invalid");
            }

            return createAuthResult(user);
        } catch (JwtException | IllegalArgumentException exception) {
            throw new InvalidTokenException("Refresh token is invalid");
        }
    }

    private AuthResult createAuthResult(User user) {
        var userDetails = toUserDetails(user);

        AuthResponse response = new AuthResponse(
                new UserResponse(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getDisplayName(),
                        user.getAvatarUrl(),
                        user.getRole().name().toLowerCase(),
                        user.getCoinBalance(),
                        user.getBio(),
                        user.getCreatedAt()
                ),
                jwtService.generateAccessToken(userDetails)
        );

        return new AuthResult(
                response,
                jwtService.generateRefreshToken(userDetails)
        );
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
}
