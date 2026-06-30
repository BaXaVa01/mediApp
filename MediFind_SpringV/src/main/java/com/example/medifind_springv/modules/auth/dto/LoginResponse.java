package com.example.medifind_springv.modules.auth.dto;

public class LoginResponse {
    private String userId;
    private String profileId;
    private String accountType;
    private String role;
    private String name;
    private String displayName;
    private String email;
    private String phone;
    private String defaultRoute;
    private String message;

    public LoginResponse() {}

    public LoginResponse(String userId, String profileId, String accountType, String role, String name, String displayName, String email, String phone, String defaultRoute, String message) {
        this.userId = userId;
        this.profileId = profileId;
        this.accountType = accountType;
        this.role = role;
        this.name = name;
        this.displayName = displayName;
        this.email = email;
        this.phone = phone != null ? phone : "";
        this.defaultRoute = defaultRoute;
        this.message = message;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getProfileId() {
        return profileId;
    }

    public void setProfileId(String profileId) {
        this.profileId = profileId;
    }

    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone != null ? phone : "";
    }

    public String getDefaultRoute() {
        return defaultRoute;
    }

    public void setDefaultRoute(String defaultRoute) {
        this.defaultRoute = defaultRoute;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
