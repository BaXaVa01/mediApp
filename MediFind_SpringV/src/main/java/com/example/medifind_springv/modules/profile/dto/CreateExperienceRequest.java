package com.example.medifind_springv.modules.profile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateExperienceRequest {

    @NotBlank(message = "El doctorId es obligatorio")
    private String doctorId;

    @NotBlank(message = "El cargo es obligatorio")
    @Size(max = 150, message = "El cargo no puede exceder los 150 caracteres.")
    private String position;

    @NotBlank(message = "La institución es obligatoria")
    @Size(max = 150, message = "La institución no puede exceder los 150 caracteres.")
    private String institution;

    private Integer startYear;
    private Integer endYear;

    @Size(max = 1000, message = "La descripción no puede exceder los 1000 caracteres.")
    private String description;

    public CreateExperienceRequest() {}

    public CreateExperienceRequest(String doctorId, String position, String institution, Integer startYear, Integer endYear, String description) {
        this.doctorId = doctorId;
        this.position = position;
        this.institution = institution;
        this.startYear = startYear;
        this.endYear = endYear;
        this.description = description;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    public Integer getStartYear() {
        return startYear;
    }

    public void setStartYear(Integer startYear) {
        this.startYear = startYear;
    }

    public Integer getEndYear() {
        return endYear;
    }

    public void setEndYear(Integer endYear) {
        this.endYear = endYear;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
