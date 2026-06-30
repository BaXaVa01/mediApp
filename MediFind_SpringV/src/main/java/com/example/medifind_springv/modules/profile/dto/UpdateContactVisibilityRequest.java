package com.example.medifind_springv.modules.profile.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateContactVisibilityRequest {

    @NotBlank(message = "El doctorId es obligatorio")
    private String doctorId;

    @Size(max = 30, message = "El teléfono público no puede exceder los 30 caracteres.")
    private String publicPhone;

    @Size(max = 150, message = "El correo público no puede exceder los 150 caracteres.")
    @Email(message = "El correo público debe tener un formato de email válido.")
    private String publicEmail;

    @Size(max = 100, message = "La ciudad no puede exceder los 100 caracteres.")
    private String city;

    @Size(max = 255, message = "El resumen de ubicación no puede exceder los 255 caracteres.")
    private String locationSummary;

    @NotNull(message = "La visibilidad del perfil es obligatoria.")
    private Boolean profileVisible;

    @NotNull(message = "La disponibilidad de consulta en línea es obligatoria.")
    private Boolean onlineConsultationAvailable;

    public UpdateContactVisibilityRequest() {}

    public UpdateContactVisibilityRequest(String doctorId, String publicPhone, String publicEmail, String city, String locationSummary, Boolean profileVisible, Boolean onlineConsultationAvailable) {
        this.doctorId = doctorId;
        this.publicPhone = publicPhone;
        this.publicEmail = publicEmail;
        this.city = city;
        this.locationSummary = locationSummary;
        this.profileVisible = profileVisible;
        this.onlineConsultationAvailable = onlineConsultationAvailable;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getPublicPhone() {
        return publicPhone;
    }

    public void setPublicPhone(String publicPhone) {
        this.publicPhone = publicPhone;
    }

    public String getPublicEmail() {
        return publicEmail;
    }

    public void setPublicEmail(String publicEmail) {
        this.publicEmail = publicEmail;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLocationSummary() {
        return locationSummary;
    }

    public void setLocationSummary(String locationSummary) {
        this.locationSummary = locationSummary;
    }

    public Boolean getProfileVisible() {
        return profileVisible;
    }

    public void setProfileVisible(Boolean profileVisible) {
        this.profileVisible = profileVisible;
    }

    public Boolean getOnlineConsultationAvailable() {
        return onlineConsultationAvailable;
    }

    public void setOnlineConsultationAvailable(Boolean onlineConsultationAvailable) {
        this.onlineConsultationAvailable = onlineConsultationAvailable;
    }
}
