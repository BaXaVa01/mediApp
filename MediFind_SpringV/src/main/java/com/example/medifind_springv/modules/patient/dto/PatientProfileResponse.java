package com.example.medifind_springv.modules.patient.dto;

public class PatientProfileResponse {
    private String patientId;
    private String userId;
    private String name;
    private String email;
    private String phone;
    private String birthDate;
    private String gender;
    private String address;
    private String photoUrl;
    private String createdAt;

    public PatientProfileResponse() {}

    public PatientProfileResponse(String patientId, String userId, String name, String email, String phone, String birthDate, String gender, String address, String photoUrl, String createdAt) {
        this.patientId = patientId;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.phone = phone != null ? phone : "";
        this.birthDate = birthDate;
        this.gender = gender;
        this.address = address != null ? address : "";
        this.photoUrl = photoUrl != null ? photoUrl : "";
        this.createdAt = createdAt;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone != null ? phone : "";
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address != null ? address : "";
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl != null ? photoUrl : "";
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}
