package com.ncomics.backend.modules.auth;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
import com.ncomics.backend.modules.auth.dto.AuthResponse;
import com.ncomics.backend.modules.auth.dto.AuthResult;
import com.ncomics.backend.modules.auth.dto.LoginRequest;
import com.ncomics.backend.modules.auth.dto.RegisterRequest;
import com.ncomics.backend.modules.auth.security.JwtService;
import com.ncomics.backend.modules.user.User;
import com.ncomics.backend.modules.user.UserRepository;
import com.ncomics.backend.modules.user.enums.Role;
import com.ncomics.backend.modules.user.enums.UserStatus;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

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
                "john", "John@Example.com ", "Password123", "John", null, null);

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(userRepository.existsByUsername("john")).thenReturn(false);
        when(passwordEncoder.encode("Password123")).thenReturn("hashedPassword");
        when(userRepository.save(any(User.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateAccessToken(any())).thenReturn("accessToken");
        when(jwtService.generateRefreshToken(any())).thenReturn("refreshToken");

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

        ArgumentCaptor<User> captor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(captor.capture());
        User saved = captor.getValue();

        assertEquals("john@example.com", saved.getEmail());
        assertEquals("hashedPassword", saved.getPasswordHash());
        assertEquals(Role.READER, saved.getRole());
        assertEquals(UserStatus.ACTIVE, saved.getStatus());
        assertEquals(100, saved.getCoinBalance());
    }

    @Test
    void register_shouldThrow_whenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest(
                "john", "john@example.com", "Password123", "John", null, null);

        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));

        verify(userRepository, never()).save(any());
    }

    @Test
    void register_shouldThrow_whenUsernameAlreadyExists() {
        RegisterRequest request = new RegisterRequest(
                "john", "john@example.com", "Password123", "John", null, null);

        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(userRepository.existsByUsername("john")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));

        verify(userRepository, never()).save(any());
    }

    @Test
    void login_shouldThrow_whenCredentialsInvalid() {
        LoginRequest request = new LoginRequest("john@example.com", "Wrong123");

        when(authenticationManager.authenticate(any()))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        assertThrows(BadCredentialsException.class, () -> authService.login(request));

        verify(userRepository, never()).findByEmail(any());
    }
}
