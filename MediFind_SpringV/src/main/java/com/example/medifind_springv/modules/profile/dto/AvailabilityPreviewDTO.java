package com.example.medifind_springv.modules.profile.dto;

public class AvailabilityPreviewDTO {
    private String date;
    private String time;

    public AvailabilityPreviewDTO() {}

    public AvailabilityPreviewDTO(String date, String time) {
        this.date = date;
        this.time = time;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }
}
