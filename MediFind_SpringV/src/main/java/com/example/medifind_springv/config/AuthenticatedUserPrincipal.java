package com.example.medifind_springv.config;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class AuthenticatedUserPrincipal implements UserDetails {

    private final String userId;
    private final String profileId;
    private final String role;
    private final String accountType;
    private final String email;

    public AuthenticatedUserPrincipal(String userId, String profileId, String role, String accountType, String email) {
        this.userId = userId;
        this.profileId = profileId;
        this.role = role;
        this.accountType = accountType;
        this.email = email;
    }

    public String getUserId() {
        return userId;
    }

    public String getProfileId() {
        return profileId;
    }

    public String getRole() {
        return role;
    }

    public String getAccountType() {
        return accountType;
    }

    public String getEmail() {
        return email;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(
                new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()),
                new SimpleGrantedAuthority(role.toUpperCase())
        );
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
