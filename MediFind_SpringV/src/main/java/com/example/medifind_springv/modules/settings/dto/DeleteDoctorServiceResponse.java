package com.example.medifind_springv.modules.settings.dto;

public class DeleteDoctorServiceResponse {
    private String id;
    private String doctorId;
    private Boolean active;
    private String message;

    public DeleteDoctorServiceResponse() {}

    public DeleteDoctorServiceResponse(String id, String doctorId, Boolean active, String message) {
        this.id = id;
        this.doctorId = doctorId;
        this.active = active;
        this.message = message;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
