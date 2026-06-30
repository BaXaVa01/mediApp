package com.example.medifind_springv.modules.settings.dto;

public class DoctorLocationResponse {
    private String id;
    private String doctorId;
    private String name;
    private String address;
    private String city;
    private Double latitude;
    private Double longitude;
    private String type;
    private String clinicId;
    private String clinicName;
    private Boolean isMain;
    private Boolean active;

    public DoctorLocationResponse() {}

    public DoctorLocationResponse(String id, String doctorId, String name, String address, String city, Double latitude, Double longitude, String type, String clinicId, String clinicName, Boolean isMain, Boolean active) {
        this.id = id;
        this.doctorId = doctorId;
        this.name = name;
        this.address = address;
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
        this.type = type;
        this.clinicId = clinicId;
        this.clinicName = clinicName;
        this.isMain = isMain;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
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

    public Boolean getIsMain() {
        return isMain;
    }

    public void setIsMain(Boolean isMain) {
        this.isMain = isMain;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }
}
