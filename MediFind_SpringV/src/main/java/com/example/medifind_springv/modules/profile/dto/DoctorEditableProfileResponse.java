package com.example.medifind_springv.modules.profile.dto;

import java.util.ArrayList;
import java.util.List;

public class DoctorEditableProfileResponse {
    private String doctorId;
    private String photoUrl;
    private ProfessionalIdentityDTO professionalIdentity;
    private ContactVisibilityDTO contactVisibility;
    private List<EducationDTO> education = new ArrayList<>();
    private List<ExperienceDTO> experience = new ArrayList<>();

    public DoctorEditableProfileResponse() {}

    public DoctorEditableProfileResponse(String doctorId, String photoUrl, ProfessionalIdentityDTO professionalIdentity, ContactVisibilityDTO contactVisibility, List<EducationDTO> education, List<ExperienceDTO> experience) {
        this.doctorId = doctorId;
        this.photoUrl = photoUrl != null ? photoUrl : "";
        this.professionalIdentity = professionalIdentity;
        this.contactVisibility = contactVisibility;
        this.education = education != null ? education : new ArrayList<>();
        this.experience = experience != null ? experience : new ArrayList<>();
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl != null ? photoUrl : "";
    }

    public ProfessionalIdentityDTO getProfessionalIdentity() {
        return professionalIdentity;
    }

    public void setProfessionalIdentity(ProfessionalIdentityDTO professionalIdentity) {
        this.professionalIdentity = professionalIdentity;
    }

    public ContactVisibilityDTO getContactVisibility() {
        return contactVisibility;
    }

    public void setContactVisibility(ContactVisibilityDTO contactVisibility) {
        this.contactVisibility = contactVisibility;
    }

    public List<EducationDTO> getEducation() {
        return education;
    }

    public void setEducation(List<EducationDTO> education) {
        this.education = education != null ? education : new ArrayList<>();
    }

    public List<ExperienceDTO> getExperience() {
        return experience;
    }

    public void setExperience(List<ExperienceDTO> experience) {
        this.experience = experience != null ? experience : new ArrayList<>();
    }
}
