package com.example.medifind_springv.modules.profile.dto;

public class AppointmentSummaryDTO {
    private String id;
    private String patientName;
    private String time;
    private String date;
    private String type;
    private String status;

    public AppointmentSummaryDTO() {}

    public AppointmentSummaryDTO(String id, String patientName, String time, String date, String type, String status) {
        this.id = id;
        this.patientName = patientName;
        this.time = time;
        this.date = date;
        this.type = type;
        this.status = status;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
