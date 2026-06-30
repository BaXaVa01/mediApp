package com.example.medifind_springv.modules.settings.dto;

import java.util.ArrayList;
import java.util.List;

public class DoctorScheduleResponse {
    private String doctorId;
    private List<DoctorDayScheduleDTO> schedule = new ArrayList<>();

    public DoctorScheduleResponse() {}

    public DoctorScheduleResponse(String doctorId, List<DoctorDayScheduleDTO> schedule) {
        this.doctorId = doctorId;
        this.schedule = schedule != null ? schedule : new ArrayList<>();
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public List<DoctorDayScheduleDTO> getSchedule() {
        return schedule;
    }

    public void setSchedule(List<DoctorDayScheduleDTO> schedule) {
        this.schedule = schedule != null ? schedule : new ArrayList<>();
    }
}
