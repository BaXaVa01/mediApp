package com.example.medifind_springv.modules.appointments.dto;

import java.util.ArrayList;
import java.util.List;

public class DoctorWeeklyCalendarResponse {
    private String doctorId;
    private String weekStart;
    private String weekEnd;
    private List<DoctorCalendarAppointmentDTO> appointments = new ArrayList<>();

    public DoctorWeeklyCalendarResponse() {}

    public DoctorWeeklyCalendarResponse(String doctorId, String weekStart, String weekEnd, List<DoctorCalendarAppointmentDTO> appointments) {
        this.doctorId = doctorId;
        this.weekStart = weekStart;
        this.weekEnd = weekEnd;
        this.appointments = appointments != null ? appointments : new ArrayList<>();
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getWeekStart() {
        return weekStart;
    }

    public void setWeekStart(String weekStart) {
        this.weekStart = weekStart;
    }

    public String getWeekEnd() {
        return weekEnd;
    }

    public void setWeekEnd(String weekEnd) {
        this.weekEnd = weekEnd;
    }

    public List<DoctorCalendarAppointmentDTO> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<DoctorCalendarAppointmentDTO> appointments) {
        this.appointments = appointments != null ? appointments : new ArrayList<>();
    }
}
