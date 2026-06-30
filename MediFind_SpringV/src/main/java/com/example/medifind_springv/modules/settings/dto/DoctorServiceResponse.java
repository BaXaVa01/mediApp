package com.example.medifind_springv.modules.settings.dto;

public class DoctorServiceResponse {
    private String id;
    private String doctorId;
    private String name;
    private String description;
    private Integer durationMinutes;
    private Double price;
    private String locationId;
    private String locationName;
    private String clinicId;
    private String clinicName;
    private Boolean active;

    public DoctorServiceResponse() {}

    public DoctorServiceResponse(String id, String doctorId, String name, String description, Integer durationMinutes, Double price, String locationId, String locationName, String clinicId, String clinicName, Boolean active) {
        this.id = id;
        this.doctorId = doctorId;
        this.name = name;
        this.description = description;
        this.durationMinutes = durationMinutes;
        this.price = price;
        this.locationId = locationId;
        this.locationName = locationName;
        this.clinicId = clinicId;
        this.clinicName = clinicName;
        this.active = active;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getLocationName() {
        return locationName;
    }

    public void setLocationName(String locationName) {
        this.locationName = locationName;
    }

    public String getClinicId() {
        return clinicId;
    }

    public void setClinicId(String clinicId) {
        this.clinicId = clinicId;
    }

    public String getClinicName() {
        return clinicName;
    }

    public void setClinicName(String clinicName) {
        this.clinicName = clinicName;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
