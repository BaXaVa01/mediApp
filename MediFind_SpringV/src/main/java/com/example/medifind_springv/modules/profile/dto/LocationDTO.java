package com.example.medifind_springv.modules.profile.dto;

public class LocationDTO {
    private Double lat;
    private Double lng;
    private String address;

    public LocationDTO() {}

    public LocationDTO(Double lat, Double lng, String address) {
        this.lat = lat;
        this.lng = lng;
        this.address = address;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLng() {
        return lng;
    }

    public void setLng(Double lng) {
        this.lng = lng;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
