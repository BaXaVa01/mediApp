package com.example.medifind_springv.modules.profile.dto;

public class DoctorProfilePhotoResponse {
    private String doctorId;
    private String photoUrl;
    private String message;

    public DoctorProfilePhotoResponse() {}

    public DoctorProfilePhotoResponse(String doctorId, String photoUrl, String message) {
        this.doctorId = doctorId;
        this.photoUrl = photoUrl;
        this.message = message;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
