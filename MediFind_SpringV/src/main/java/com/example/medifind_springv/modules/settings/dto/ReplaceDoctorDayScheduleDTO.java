package com.example.medifind_springv.modules.settings.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.ArrayList;
import java.util.List;

public class ReplaceDoctorDayScheduleDTO {

    @NotNull(message = "El día de la semana es obligatorio")
    @Min(value = 1, message = "El día debe ser al menos 1")
    @Max(value = 7, message = "El día no puede ser mayor a 7")
    private Integer dayOfWeek;

    @Valid
    private List<ReplaceDoctorScheduleBlockDTO> blocks = new ArrayList<>();

    public ReplaceDoctorDayScheduleDTO() {}

    public ReplaceDoctorDayScheduleDTO(Integer dayOfWeek, List<ReplaceDoctorScheduleBlockDTO> blocks) {
        this.dayOfWeek = dayOfWeek;
        this.blocks = blocks != null ? blocks : new ArrayList<>();
    }

    public Integer getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(Integer dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public List<ReplaceDoctorScheduleBlockDTO> getBlocks() {
        return blocks;
    }

    public void setBlocks(List<ReplaceDoctorScheduleBlockDTO> blocks) {
        this.blocks = blocks != null ? blocks : new ArrayList<>();
    }
}
