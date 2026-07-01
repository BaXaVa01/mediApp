package com.example.medifind_springv.modules.patient.dto;

public class PatientAppointmentDTO {
    private String id;
    private String date;
    private String startTime;
    private String endTime;
    private String status;
    private String statusLabel;
    private String reason;
    private String notes;
    private double reservedPrice;
    private String createdAt;
    private String updatedAt;
    private boolean canCancel;
    private PatientAppointmentDoctorDTO doctor;
    private PatientAppointmentServiceDTO service;
    private PatientAppointmentLocationDTO location;

    public PatientAppointmentDTO() {}

    public PatientAppointmentDTO(String id, String date, String startTime, String endTime, String status, String statusLabel, String reason, String notes, double reservedPrice, String createdAt, String updatedAt, boolean canCancel, PatientAppointmentDoctorDTO doctor, PatientAppointmentServiceDTO service, PatientAppointmentLocationDTO location) {
        this.id = id;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.statusLabel = statusLabel;
        this.reason = reason != null ? reason : "";
        this.notes = notes != null ? notes : "";
        this.reservedPrice = reservedPrice;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.canCancel = canCancel;
        this.doctor = doctor;
        this.service = service;
        this.location = location;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getStatusLabel() {
        return statusLabel;
    }

    public void setStatusLabel(String statusLabel) {
        this.statusLabel = statusLabel;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason != null ? reason : "";
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes != null ? notes : "";
    }

    public double getReservedPrice() {
        return reservedPrice;
    }

    public void setReservedPrice(double reservedPrice) {
        this.reservedPrice = reservedPrice;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isCanCancel() {
        return canCancel;
    }

    public void setCanCancel(boolean canCancel) {
        this.canCancel = canCancel;
    }

    public PatientAppointmentDoctorDTO getDoctor() {
        return doctor;
    }

    public void setDoctor(PatientAppointmentDoctorDTO doctor) {
        this.doctor = doctor;
    }

    public PatientAppointmentServiceDTO getService() {
        return service;
    }

    public void setService(PatientAppointmentServiceDTO service) {
        this.service = service;
    }

    public PatientAppointmentLocationDTO getLocation() {
        return location;
    }

    public void setLocation(PatientAppointmentLocationDTO location) {
        this.location = location;
    }
}
