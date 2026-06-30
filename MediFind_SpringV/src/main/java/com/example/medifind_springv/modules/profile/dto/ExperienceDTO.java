package com.example.medifind_springv.modules.profile.dto;

public class ExperienceDTO {
    private String id;
    private String position;
    private String institution;
    private Integer startYear;
    private Integer endYear;
    private String description;

    public ExperienceDTO() {}

    public ExperienceDTO(String id, String position, String institution, Integer startYear, Integer endYear, String description) {
        this.id = id;
        this.position = position;
        this.institution = institution;
        this.startYear = startYear;
        this.endYear = endYear;
        this.description = description != null ? description : "";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
        this.description = description != null ? description : "";
    }
}
