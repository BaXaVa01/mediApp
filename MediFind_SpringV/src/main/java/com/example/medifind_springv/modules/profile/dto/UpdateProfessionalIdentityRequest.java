package com.example.medifind_springv.modules.profile.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateProfessionalIdentityRequest {

    @NotBlank(message = "El doctorId es obligatorio")
    private String doctorId;

    @NotBlank(message = "El nombre público es obligatorio")
    @Size(min = 2, max = 120, message = "El nombre público debe tener entre 2 y 120 caracteres.")
    private String publicName;

    private String mainSpecialtyId;

    @Size(max = 160, message = "El titular profesional no puede exceder los 160 caracteres.")
    private String headline;

    @Size(max = 3000, message = "La biografía no puede exceder los 3000 caracteres.")
    private String bio;

    @Min(value = 0, message = "Los años de experiencia deben ser mayores o iguales a 0.")
    @Max(value = 80, message = "Los años de experiencia no pueden exceder los 80 años.")
    private Integer yearsOfExperience;

    public UpdateProfessionalIdentityRequest() {}

    public UpdateProfessionalIdentityRequest(String doctorId, String publicName, String mainSpecialtyId, String headline, String bio, Integer yearsOfExperience) {
        this.doctorId = doctorId;
        this.publicName = publicName;
        this.mainSpecialtyId = mainSpecialtyId;
        this.headline = headline;
        this.bio = bio;
        this.yearsOfExperience = yearsOfExperience;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
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

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Integer getYearsOfExperience() {
        return yearsOfExperience;
    }

    public void setYearsOfExperience(Integer yearsOfExperience) {
        this.yearsOfExperience = yearsOfExperience;
    }
}
