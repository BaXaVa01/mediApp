package com.example.medifind_springv.modules.patient.dto;

public class PatientAppointmentLocationDTO {
    private String id;
    private String name;
    private String type;
    private String address;
    private String city;
    private double latitude;
    private double longitude;

    public PatientAppointmentLocationDTO() {}

    public PatientAppointmentLocationDTO(String id, String name, String type, String address, String city, double latitude, double longitude) {
        this.id = id;
        this.name = name;
        this.type = type != null ? type : "PRESENCIAL";
        this.address = address != null ? address : "";
        this.city = city != null ? city : "";
        this.latitude = latitude;
        this.longitude = longitude;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type != null ? type : "PRESENCIAL";
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address != null ? address : "";
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city != null ? city : "";
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }
}
