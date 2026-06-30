package com.example.medifind_springv.modules.settings.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

public class UpdateDoctorServiceRequest {

    @NotBlank(message = "El doctorId es obligatorio")
    private String doctorId;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 3, max = 150, message = "El nombre del servicio debe tener entre 3 y 150 caracteres.")
    private String name;

    @Size(max = 1000, message = "La descripción no puede exceder los 1000 caracteres.")
    private String description;

    @NotNull(message = "La duración es obligatoria")
    private Integer durationMinutes;

    @NotNull(message = "El precio es obligatorio")
    @PositiveOrZero(message = "El precio del servicio no puede ser negativo.")
    private Double price;

    private String locationId;
    private String clinicId;
    private Boolean active;

    public UpdateDoctorServiceRequest() {}

    public UpdateDoctorServiceRequest(String doctorId, String name, String description, Integer durationMinutes, Double price, String locationId, String clinicId, Boolean active) {
        this.doctorId = doctorId;
        this.name = name;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.price = price;
        this.locationId = locationId;
        this.clinicId = clinicId;
        this.active = active;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }

    public String getClinicId() {
        return clinicId;
    }

    public void setClinicId(String clinicId) {
        this.clinicId = clinicId;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
