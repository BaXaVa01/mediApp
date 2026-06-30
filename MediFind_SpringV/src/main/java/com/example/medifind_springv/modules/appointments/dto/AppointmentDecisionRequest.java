package com.example.medifind_springv.modules.appointments.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class AppointmentDecisionRequest {

    @NotBlank(message = "El doctorId es obligatorio")
    private String doctorId;

    @NotBlank(message = "La decisión es obligatoria")
    @Pattern(regexp = "^(ACCEPT|REJECT)$", message = "La decisión debe ser ACCEPT o REJECT")
    private String decision;

    @Size(max = 1000, message = "Las notas no pueden exceder los 1000 caracteres")
    private String notes;

    public AppointmentDecisionRequest() {}

    public AppointmentDecisionRequest(String doctorId, String decision, String notes) {
        this.doctorId = doctorId;
        this.decision = decision;
        this.notes = notes;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
