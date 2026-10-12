package com.ncomics.backend.modules.auth.implement;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.ncomics.backend.modules.user.entity.User;
import com.ncomics.backend.modules.user.enums.UserStatus;

public class CustomUserDetails implements UserDetails {

    private final User user;

    public CustomUserDetails(User user) {
        this.user = user;
    }

    public Long getId() { return user.getId(); }
    public String getDisplayName() { return user.getDisplayName(); }
    public User getUser() { return user; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));
    }

    @Override public String getPassword() { return user.getPasswordHash(); }

    @Override public String getUsername() { return user.getEmail(); }

    @Override public boolean isAccountNonExpired() { return true; }

    @Override public boolean isAccountNonLocked() {
        return user.getStatus() != UserStatus.BANNED;    
    }

    @Override public boolean isCredentialsNonExpired() { return true; }

    @Override public boolean isEnabled() {
        return user.getStatus() == UserStatus.ACTIVE;
    }
}
