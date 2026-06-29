package com.example.medifind_springv.modules.profile.dto;

public class ScheduleDTO {
    private String day;
    private String hours;

    public ScheduleDTO() {}

    public ScheduleDTO(String day, String hours) {
        this.day = day;
        this.hours = hours;
    }

    public String getDay() {
        return day;
    }

    public void setDay(String day) {
        this.day = day;
    }

    public String getHours() {
        return hours;
    }

    public void setHours(String hours) {
        this.hours = hours;
    }
}
