package com.example.medifind_springv.modules.profile.dto;

public class EducationDTO {
    private String id;
    private String title;
    private String institution;
    private Integer startYear;
    private Integer endYear;
    private String description;

    public EducationDTO() {}

    public EducationDTO(String id, String title, String institution, Integer startYear, Integer endYear, String description) {
        this.id = id;
        this.title = title;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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
