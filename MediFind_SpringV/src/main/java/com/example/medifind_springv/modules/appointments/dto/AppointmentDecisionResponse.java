package com.example.medifind_springv.modules.appointments.dto;

public class AppointmentDecisionResponse {
    private String appointmentId;
    private String status;
    private String message;

    public AppointmentDecisionResponse() {}

    public AppointmentDecisionResponse(String appointmentId, String status, String message) {
        this.appointmentId = appointmentId;
        this.status = status;
        this.message = message;
    }

    public String getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(String appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
