package com.example.medifind_springv.modules.settings.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class DoctorScheduleBlockDTO {
    private String id;
    private String locationId;
    private String locationName;
    private String startTime;
    private String endTime;
    private Integer appointmentDurationMinutes;
    private Boolean active;

    @JsonIgnore
    private Integer dayOfWeek;

    public DoctorScheduleBlockDTO() {}

    public DoctorScheduleBlockDTO(String id, String locationId, String locationName, String startTime, String endTime, Integer appointmentDurationMinutes, Boolean active) {
        this.id = id;
        this.locationId = locationId;
        this.locationName = locationName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.appointmentDurationMinutes = appointmentDurationMinutes;
        this.active = active;
    }

    public DoctorScheduleBlockDTO(String id, String locationId, String locationName, String startTime, String endTime, Integer appointmentDurationMinutes, Boolean active, Integer dayOfWeek) {
        this.id = id;
        this.locationId = locationId;
        this.locationName = locationName;
        this.startTime = startTime;
        this.endTime = endTime;
        this.appointmentDurationMinutes = appointmentDurationMinutes;
        this.active = active;
        this.dayOfWeek = dayOfWeek;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
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

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Integer getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(Integer dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }
}
