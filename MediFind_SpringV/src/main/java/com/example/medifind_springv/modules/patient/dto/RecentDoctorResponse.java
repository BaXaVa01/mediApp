package com.example.medifind_springv.modules.patient.dto;

public class RecentDoctorResponse {
    private String doctorId;
    private String name;
    private String specialty;
    private String headline;
    private String photoUrl;
    private String city;
    private String locationSummary;
    private double rating;
    private int reviewCount;
    private double basePrice;
    private String viewedAt;

    public RecentDoctorResponse() {}

    public RecentDoctorResponse(String doctorId, String name, String specialty, String headline, String photoUrl, String city, String locationSummary, double rating, int reviewCount, double basePrice, String viewedAt) {
        this.doctorId = doctorId;
        this.name = name;
        this.specialty = specialty != null ? specialty : "";
        this.headline = headline != null ? headline : "";
        this.photoUrl = photoUrl != null ? photoUrl : "";
        this.city = city != null ? city : "";
        this.locationSummary = locationSummary != null ? locationSummary : "";
        this.rating = rating;
        this.reviewCount = reviewCount;
        this.basePrice = basePrice;
        this.viewedAt = viewedAt;
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

    public double getRating() {
        return rating;
    }

    public void setRating(double rating) {
        this.rating = rating;
    }

    public int getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(int reviewCount) {
        this.reviewCount = reviewCount;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    public String getViewedAt() {
        return viewedAt;
    }

    public void setViewedAt(String viewedAt) {
        this.viewedAt = viewedAt;
    }
}
