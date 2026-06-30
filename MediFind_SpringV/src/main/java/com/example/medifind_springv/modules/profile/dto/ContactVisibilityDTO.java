package com.example.medifind_springv.modules.profile.dto;

public class ContactVisibilityDTO {
    private String publicPhone;
    private String publicEmail;
    private String city;
    private String locationSummary;
    private Boolean profileVisible;
    private Boolean onlineConsultationAvailable;

    public ContactVisibilityDTO() {}

    public ContactVisibilityDTO(String publicPhone, String publicEmail, String city, String locationSummary, Boolean profileVisible, Boolean onlineConsultationAvailable) {
        this.publicPhone = publicPhone != null ? publicPhone : "";
        this.publicEmail = publicEmail != null ? publicEmail : "";
        this.city = city != null ? city : "";
        this.locationSummary = locationSummary != null ? locationSummary : "";
        this.profileVisible = profileVisible != null ? profileVisible : false;
        this.onlineConsultationAvailable = onlineConsultationAvailable != null ? onlineConsultationAvailable : false;
    }

    public String getPublicPhone() {
        return publicPhone;
    }

    public void setPublicPhone(String publicPhone) {
        this.publicPhone = publicPhone != null ? publicPhone : "";
    }

    public String getPublicEmail() {
        return publicEmail;
    }

    public void setPublicEmail(String publicEmail) {
        this.publicEmail = publicEmail != null ? publicEmail : "";
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city != null ? city : "";
    }

    public String getLocationSummary() {
        return locationSummary;
    }

    public void setLocationSummary(String locationSummary) {
        this.locationSummary = locationSummary != null ? locationSummary : "";
    }

    public Boolean getProfileVisible() {
        return profileVisible;
    }

    public void setProfileVisible(Boolean profileVisible) {
        this.profileVisible = profileVisible != null ? profileVisible : false;
    }

    public Boolean getOnlineConsultationAvailable() {
        return onlineConsultationAvailable;
    }

    public void setOnlineConsultationAvailable(Boolean onlineConsultationAvailable) {
        this.onlineConsultationAvailable = onlineConsultationAvailable != null ? onlineConsultationAvailable : false;
    }
}
