package com.example.medifind_springv.modules.auth.dto;

public class RegisterUserResponse {
    private String userId;
    private String profileId;
    private String accountType;
    private String name;
    private String email;
    private String role;
    private String message;

    public RegisterUserResponse() {}

    public RegisterUserResponse(String userId, String profileId, String accountType, String name, String email, String role, String message) {
        this.userId = userId;
        this.profileId = profileId;
        this.accountType = accountType;
        this.name = name;
        this.email = email;
        this.role = role;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
