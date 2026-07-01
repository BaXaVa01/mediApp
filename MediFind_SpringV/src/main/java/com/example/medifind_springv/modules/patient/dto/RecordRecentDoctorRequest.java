package com.example.medifind_springv.modules.patient.dto;

import jakarta.validation.constraints.NotBlank;

public class RecordRecentDoctorRequest {

    @NotBlank(message = "El patientId es obligatorio")
    private String patientId;

    @NotBlank(message = "El doctorId es obligatorio")
    private String doctorId;

    public RecordRecentDoctorRequest() {}

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }
}
