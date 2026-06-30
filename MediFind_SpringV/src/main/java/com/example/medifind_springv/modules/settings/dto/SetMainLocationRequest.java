package com.example.medifind_springv.modules.settings.dto;

import jakarta.validation.constraints.NotBlank;

public class SetMainLocationRequest {

    @NotBlank(message = "El doctorId es obligatorio")
    private String doctorId;

    public SetMainLocationRequest() {}

    public SetMainLocationRequest(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }
}
