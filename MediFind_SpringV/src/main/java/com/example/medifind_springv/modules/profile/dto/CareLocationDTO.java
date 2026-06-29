package com.example.medifind_springv.modules.profile.dto;

public class CareLocationDTO {
    private String name;
    private String address;
    private String phone;
    private String availability;

    public CareLocationDTO() {}

    public CareLocationDTO(String name, String address, String phone, String availability) {
        this.name = name;
        this.address = address;
        this.phone = phone;
        this.availability = availability;
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

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }
}
