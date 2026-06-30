package com.example.medifind_springv.modules.appointments.dto;

public class AppointmentSlotDTO {
    private String startTime;
    private String endTime;
    private boolean available;

    public AppointmentSlotDTO() {}

    public AppointmentSlotDTO(String startTime, String endTime, boolean available) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.available = available;
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

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
