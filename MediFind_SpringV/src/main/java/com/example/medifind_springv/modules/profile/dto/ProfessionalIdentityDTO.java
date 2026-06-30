package com.example.medifind_springv.modules.profile.dto;

public class ProfessionalIdentityDTO {
    private String publicName;
    private String mainSpecialtyId;
    private String mainSpecialtyName;
    private String headline;
    private String bio;
    private Integer yearsOfExperience;

    public ProfessionalIdentityDTO() {}

    public ProfessionalIdentityDTO(String publicName, String mainSpecialtyId, String mainSpecialtyName, String headline, String bio, Integer yearsOfExperience) {
        this.publicName = publicName;
        this.mainSpecialtyId = mainSpecialtyId;
        this.mainSpecialtyName = mainSpecialtyName;
        this.headline = headline != null ? headline : "";
        this.bio = bio != null ? bio : "";
        this.yearsOfExperience = yearsOfExperience != null ? yearsOfExperience : 0;
    }

    public String getPublicName() {
        return publicName;
    }

    public void setPublicName(String publicName) {
        this.publicName = publicName;
    }

    public String getMainSpecialtyId() {
        return mainSpecialtyId;
    }

    public void setMainSpecialtyId(String mainSpecialtyId) {
        this.mainSpecialtyId = mainSpecialtyId;
    }

    public String getMainSpecialtyName() {
        return mainSpecialtyName;
    }

    public void setMainSpecialtyName(String mainSpecialtyName) {
        this.mainSpecialtyName = mainSpecialtyName;
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline != null ? headline : "";
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio != null ? bio : "";
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience != null ? yearsOfExperience : 0;
    }
}
