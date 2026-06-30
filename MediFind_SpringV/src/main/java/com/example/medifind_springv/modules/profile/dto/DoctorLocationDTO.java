package com.example.medifind_springv.modules.profile.dto;

public class DoctorLocationDTO {
    private String id;
    private String name;
    private String type;
    private String address;
    private String city;
    private String clinicId;
    private String clinicName;
    private Boolean isMain;
    private Boolean active;

    public DoctorLocationDTO() {}

    public DoctorLocationDTO(String id, String name, String type, String address, String city, String clinicId, String clinicName, Boolean isMain, Boolean active) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.address = address;
        this.city = city;
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
        this.type = type;
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
