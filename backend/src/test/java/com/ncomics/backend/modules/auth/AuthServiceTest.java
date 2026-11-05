package com.ncomics.backend.modules.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.Date;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.ncomics.backend.common.exception.DuplicateResourceException;
import com.ncomics.backend.common.exception.InvalidTokenException;
import com.ncomics.backend.modules.auth.dto.response.AuthResponse;
import com.ncomics.backend.modules.auth.dto.AuthResult;
import com.ncomics.backend.modules.auth.dto.request.LoginRequest;
import com.ncomics.backend.modules.auth.dto.request.RegisterRequest;
import com.ncomics.backend.modules.auth.entity.RefreshToken;
import com.ncomics.backend.modules.auth.security.JwtService;
import com.ncomics.backend.modules.user.UserRepository;
import com.ncomics.backend.modules.user.entity.User;
import com.ncomics.backend.modules.user.enums.Role;
import com.ncomics.backend.modules.user.enums.UserStatus;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    @Test
    void register_shouldCreateUserAndReturnTokens() {
        RegisterRequest request = new RegisterRequest(
                "john", "John@Example.com ", "Password123", "John");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(userRepository.existsByUsername("john")).thenReturn(false);
        when(passwordEncoder.encode("Password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateAccessToken(any())).thenReturn("accessToken");
        when(jwtService.generateRefreshToken(any())).thenReturn("refreshToken");
        when(jwtService.extractExpiration(any())).thenReturn(futureDate());

        AuthResult result = authService.register(request);
        AuthResponse response = result.response();

        assertNotNull(response);
        assertEquals("accessToken", response.accessToken());
        assertEquals("refreshToken", result.refreshToken());
        assertEquals("john", response.user().username());
        assertEquals("john@example.com", response.user().email());
        assertEquals("John", response.user().displayName());
        assertNull(response.user().avatarUrl());
        assertNull(response.user().bio());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        User saved = userCaptor.getValue();

        assertEquals("john@example.com", saved.getEmail());
        assertEquals("hashedPassword", saved.getPasswordHash());
        assertEquals(Role.READER, saved.getRole());
        assertEquals(UserStatus.ACTIVE, saved.getStatus());
        assertEquals(100, saved.getCoinBalance());

        ArgumentCaptor<RefreshToken> tokenCaptor =
                ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(tokenCaptor.capture());
        RefreshToken savedToken = tokenCaptor.getValue();
        assertFalse(savedToken.isRevoked());
        assertEquals(saved, savedToken.getUser());
        assertEquals(64, savedToken.getTokenHash().length());
    }

    @Test
    void register_shouldThrow_whenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest(
                "john", "john@example.com", "Password123", "John");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));

        verify(userRepository, never()).save(any());
    }

    @Test
    void register_shouldThrow_whenUsernameAlreadyExists() {
        RegisterRequest request = new RegisterRequest(
                "john", "john@example.com", "Password123", "John");

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(userRepository.existsByUsername("john")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));

        verify(userRepository, never()).save(any());
    }

    @Test
    void login_shouldThrow_whenCredentialsInvalid() {
        LoginRequest request = new LoginRequest("john@example.com", "Wrong123", true);

        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));

        verify(userRepository, never()).findByEmail(any());
    }

    @Test
    void login_shouldReturnTokens_whenCredentialsValid() {
        LoginRequest request = new LoginRequest("John@Example.com", "Password123", true);
        User user = activeUser();

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateAccessToken(any())).thenReturn("accessToken");
        when(jwtService.generateRefreshToken(any())).thenReturn("refreshToken");
        when(jwtService.extractExpiration(any())).thenReturn(futureDate());

        AuthResult result = authService.login(request);

        assertEquals("accessToken", result.response().accessToken());
        assertEquals("refreshToken", result.refreshToken());
        assertTrue(result.persistent());
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    void login_shouldStoreNonPersistentToken_whenRememberIsFalse() {
        LoginRequest request = new LoginRequest("john@example.com", "Password123", false);
        User user = activeUser();

        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateAccessToken(any())).thenReturn("accessToken");
        when(jwtService.generateRefreshToken(any())).thenReturn("refreshToken");
        when(jwtService.extractExpiration(any())).thenReturn(futureDate());

        AuthResult result = authService.login(request);

        assertFalse(result.persistent());

        ArgumentCaptor<RefreshToken> tokenCaptor =
                ArgumentCaptor.forClass(RefreshToken.class);
        verify(refreshTokenRepository).save(tokenCaptor.capture());
        assertFalse(tokenCaptor.getValue().isPersistent());
    }

    @Test
    void refresh_shouldRotateToken() {
        User user = activeUser();
        RefreshToken storedToken = RefreshToken.builder()
                .tokenHash("hash")
                .user(user)
                .expiresAt(Instant.now().plusSeconds(60))
                .revoked(false)
                .build();

        when(jwtService.extractUsername("oldRefresh")).thenReturn("john@example.com");
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(jwtService.isRefreshTokenValid(anyString(), any())).thenReturn(true);
        when(refreshTokenRepository.findByTokenHash(anyString()))
                .thenReturn(Optional.of(storedToken));
        when(jwtService.generateAccessToken(any())).thenReturn("newAccess");
        when(jwtService.generateRefreshToken(any())).thenReturn("newRefresh");
        when(jwtService.extractExpiration(any())).thenReturn(futureDate());

        AuthResult result = authService.refresh("oldRefresh");

        assertEquals("newAccess", result.response().accessToken());
        assertEquals("newRefresh", result.refreshToken());
        assertTrue(storedToken.isRevoked());
        verify(refreshTokenRepository).save(storedToken);
    }

    @Test
    void refresh_shouldRejectRevokedToken() {
        User user = activeUser();
        RefreshToken storedToken = RefreshToken.builder()
                .tokenHash("hash")
                .user(user)
                .expiresAt(Instant.now().plusSeconds(60))
                .revoked(true)
                .build();

        when(jwtService.extractUsername("oldRefresh")).thenReturn("john@example.com");
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(user));
        when(jwtService.isRefreshTokenValid(anyString(), any())).thenReturn(true);
        when(refreshTokenRepository.findByTokenHash(anyString()))
                .thenReturn(Optional.of(storedToken));

        assertThrows(InvalidTokenException.class, () -> authService.refresh("oldRefresh"));
    }

    @Test
    void refresh_shouldRejectMissingToken() {
        assertThrows(InvalidTokenException.class, () -> authService.refresh("  "));
    }

    @Test
    void logout_shouldRevokeStoredToken() {
        RefreshToken storedToken = RefreshToken.builder()
                .tokenHash("hash")
                .revoked(false)
                .build();

        when(refreshTokenRepository.findByTokenHash(anyString()))
                .thenReturn(Optional.of(storedToken));

        authService.logout("refreshToken");

        assertTrue(storedToken.isRevoked());
        verify(refreshTokenRepository).save(storedToken);
    }

    private User activeUser() {
        return User.builder()
                .id(1L)
                .username("john")
                .email("john@example.com")
                .passwordHash("hashedPassword")
                .displayName("John")
                .role(Role.READER)
                .status(UserStatus.ACTIVE)
                .coinBalance(100)
                .build();
    }

    private Date futureDate() {
        return Date.from(Instant.now().plusSeconds(3600));
    }
}
