package com.ncomics.backend.modules.user;

import org.springframework.stereotype.Service;

import com.ncomics.backend.modules.user.entity.User;
import org.springframework.transaction.annotation.Transactional;

import com.ncomics.backend.modules.user.dto.UserProfileResponse;
import com.ncomics.backend.modules.user.enums.Role;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserProfileResponse getProfile(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return UserProfileResponse.from(user);
    }

    @Transactional
    public UserProfileResponse becomeAuthor(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.getRole() == Role.READER) {
            user.setRole(Role.AUTHOR);
            userRepository.save(user);
        }

        return UserProfileResponse.from(user);
    }
}
