package com.example.medifind_springv.modules.settings.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class ReplaceDoctorScheduleBlockDTO {

    @NotBlank(message = "El locationId es obligatorio")
    private String locationId;

    @NotBlank(message = "La hora de inicio es obligatoria")
    private String startTime;

    @NotBlank(message = "La hora de fin es obligatoria")
    private String endTime;

    @NotNull(message = "La duración de la cita es obligatoria")
    @Positive(message = "La duración debe ser mayor que 0")
    private Integer appointmentDurationMinutes;

    public ReplaceDoctorScheduleBlockDTO() {}

    public ReplaceDoctorScheduleBlockDTO(String locationId, String startTime, String endTime, Integer appointmentDurationMinutes) {
        this.locationId = locationId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.appointmentDurationMinutes = appointmentDurationMinutes;
    }

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
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

    public Integer getAppointmentDurationMinutes() {
        return appointmentDurationMinutes;
    }

    public void setAppointmentDurationMinutes(Integer appointmentDurationMinutes) {
        this.appointmentDurationMinutes = appointmentDurationMinutes;
    }
}
