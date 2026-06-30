package com.example.medifind_springv.modules.settings.dto;

import java.util.ArrayList;
import java.util.List;

public class DoctorDayScheduleDTO {
    private Integer dayOfWeek;
    private String dayName;
    private List<DoctorScheduleBlockDTO> blocks = new ArrayList<>();

    public DoctorDayScheduleDTO() {}

    public DoctorDayScheduleDTO(Integer dayOfWeek, String dayName, List<DoctorScheduleBlockDTO> blocks) {
        this.dayOfWeek = dayOfWeek;
        this.dayName = dayName;
        this.blocks = blocks != null ? blocks : new ArrayList<>();
    }

    public Integer getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(Integer dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getDayName() {
        return dayName;
    }

    public void setDayName(String dayName) {
        this.dayName = dayName;
    }

    public List<DoctorScheduleBlockDTO> getBlocks() {
        return blocks;
    }

    public void setBlocks(List<DoctorScheduleBlockDTO> blocks) {
        this.blocks = blocks != null ? blocks : new ArrayList<>();
    }
}
