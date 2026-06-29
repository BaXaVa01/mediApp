package com.example.medifind_springv.modules.profile.dto;

public class ReviewDTO {
    private String patientName;
    private String comment;
    private Integer rating;
    private String date;

    public ReviewDTO() {}

    public ReviewDTO(String patientName, String comment, Integer rating, String date) {
        this.patientName = patientName;
        this.comment = comment;
        this.rating = rating;
        this.date = date;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}
