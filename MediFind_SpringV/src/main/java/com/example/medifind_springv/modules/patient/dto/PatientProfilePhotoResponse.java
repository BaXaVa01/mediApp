package com.example.medifind_springv.modules.patient.dto;

public class PatientProfilePhotoResponse {
    private String patientId;
    private String photoUrl;
    private String message;

    public PatientProfilePhotoResponse() {}

    public PatientProfilePhotoResponse(String patientId, String photoUrl, String message) {
        this.patientId = patientId;
        this.photoUrl = photoUrl;
        this.message = message;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
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
