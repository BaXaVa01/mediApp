package com.example.medifind_springv.modules.patient.dto;

public class PatientAppointmentDoctorDTO {
    private String id;
    private String name;
    private String specialty;
    private String headline;
    private String photoUrl;

    public PatientAppointmentDoctorDTO() {}

    public PatientAppointmentDoctorDTO(String id, String name, String specialty, String headline, String photoUrl) {
        this.id = id;
        this.name = name;
        this.specialty = specialty != null ? specialty : "";
        this.headline = headline != null ? headline : "";
        this.photoUrl = photoUrl != null ? photoUrl : "";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty != null ? specialty : "";
    }

    public String getHeadline() {
        return headline;
    }

    public void setHeadline(String headline) {
        this.headline = headline != null ? headline : "";
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl != null ? photoUrl : "";
    }
}
