package com.example.medifind_springv.modules.appointments.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class DoctorCalendarAppointmentDTO {
    private String id;
    private String date;
    private String startTime;
    private String endTime;
    private String status;
    private CalendarPatientDTO patient;

    @JsonProperty("case")
    private CalendarCaseDTO caseData;

    private CalendarLocationDTO location;

    public DoctorCalendarAppointmentDTO() {}

    public DoctorCalendarAppointmentDTO(String id, String date, String startTime, String endTime, String status, CalendarPatientDTO patient, CalendarCaseDTO caseData, CalendarLocationDTO location) {
        this.id = id;
        this.date = date;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = status;
        this.patient = patient;
        this.caseData = caseData;
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

    public CalendarPatientDTO getPatient() {
        return patient;
    }

    public void setPatient(CalendarPatientDTO patient) {
        this.patient = patient;
    }

    public CalendarCaseDTO getCaseData() {
        return caseData;
    }

    public void setCaseData(CalendarCaseDTO caseData) {
        this.caseData = caseData;
    }

    public CalendarLocationDTO getLocation() {
        return location;
    }

    public void setLocation(CalendarLocationDTO location) {
        this.location = location;
    }
}
