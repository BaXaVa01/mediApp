package com.example.medifind_springv.modules.settings.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

public class ReplaceDoctorScheduleRequest {

    @NotBlank(message = "El doctorId es obligatorio")
    private String doctorId;

    @NotNull(message = "El horario es obligatorio")
    @Valid
    private List<ReplaceDoctorDayScheduleDTO> schedule = new ArrayList<>();

    public ReplaceDoctorScheduleRequest() {}

    public ReplaceDoctorScheduleRequest(String doctorId, List<ReplaceDoctorDayScheduleDTO> schedule) {
        this.doctorId = doctorId;
        this.schedule = schedule != null ? schedule : new ArrayList<>();
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public List<ReplaceDoctorDayScheduleDTO> getSchedule() {
        return schedule;
    }

    public void setSchedule(List<ReplaceDoctorDayScheduleDTO> schedule) {
        this.schedule = schedule != null ? schedule : new ArrayList<>();
    }
}
