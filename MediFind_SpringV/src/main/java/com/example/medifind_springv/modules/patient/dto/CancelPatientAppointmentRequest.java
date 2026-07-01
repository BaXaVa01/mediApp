package com.example.medifind_springv.modules.patient.dto;

import jakarta.validation.constraints.NotBlank;

public class CancelPatientAppointmentRequest {

    @NotBlank(message = "El patientId es obligatorio")
    private String patientId;

    private String reason;

    public CancelPatientAppointmentRequest() {}

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
