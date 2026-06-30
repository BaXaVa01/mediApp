package com.example.medifind_springv.modules.appointments.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateAppointmentRequest {

    @NotBlank(message = "El paciente es obligatorio")
    private String patientId;

    @NotBlank(message = "El doctor es obligatorio")
    private String doctorId;

    @NotBlank(message = "El servicio es obligatorio")
    private String serviceId;

    @NotBlank(message = "El lugar de atención es obligatorio")
    private String locationId;

    @NotBlank(message = "La fecha es obligatoria")
    private String date;

    @NotBlank(message = "La hora de inicio es obligatoria")
    private String startTime;

    @Size(max = 500, message = "El motivo de consulta no puede exceder los 500 caracteres")
    private String reason;

    @Size(max = 1000, message = "Las notas no pueden exceder los 1000 caracteres")
    private String notes;

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

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
