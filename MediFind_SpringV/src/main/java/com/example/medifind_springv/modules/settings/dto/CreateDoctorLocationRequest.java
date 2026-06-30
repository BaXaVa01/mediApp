package com.example.medifind_springv.modules.settings.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateDoctorLocationRequest {

    @NotBlank(message = "El doctorId es obligatorio")
    private String doctorId;

    @NotBlank(message = "El nombre del lugar es obligatorio.")
    @Size(max = 150, message = "El nombre del lugar no puede superar los 150 caracteres.")
    private String name;

    private String address;

    @Size(max = 100, message = "La ciudad no puede superar los 100 caracteres.")
    private String city;

    private Double latitude;
    private Double longitude;

    @NotBlank(message = "El tipo de lugar de atención es obligatorio.")
    private String type;

    private Boolean isMain;

    public CreateDoctorLocationRequest() {}

    public CreateDoctorLocationRequest(String doctorId, String name, String address, String city, Double latitude, Double longitude, String type, Boolean isMain) {
        this.doctorId = doctorId;
        this.name = name;
        this.address = address;
        this.city = city;
        this.latitude = latitude;
        this.longitude = longitude;
        this.type = type;
        this.isMain = isMain;
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

    public Boolean getIsMain() {
        return isMain;
    }

    public void setIsMain(Boolean isMain) {
        this.isMain = isMain;
    }
}
