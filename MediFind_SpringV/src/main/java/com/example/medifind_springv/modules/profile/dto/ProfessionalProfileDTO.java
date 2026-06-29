package com.example.medifind_springv.modules.profile.dto;

import java.util.ArrayList;
import java.util.List;

public class ProfessionalProfileDTO {
    private String id = "";
    private String name = "";
    private String specialty = "";
    private String bio = "";
    private Double rating = 0.0;
    private Integer reviewCount = 0;
    private Double price = 0.0;
    private String photo = "";
    private LocationDTO location = null;
    private List<LocationDTO> locations = new ArrayList<>();
    private List<String> availability = new ArrayList<>();
    private List<AvailabilityPreviewDTO> availabilityPreview = new ArrayList<>();
    private List<String> consultationTypes = new ArrayList<>();
    private List<String> insurance = new ArrayList<>();
    private List<String> titles = new ArrayList<>();
    private String experience = "";
    private List<String> services = new ArrayList<>();
    private String licenseNumber = "";
    private List<String> diseasesTreated = new ArrayList<>();
    private List<String> patientTypes = new ArrayList<>();
    private List<String> education = new ArrayList<>();
    private List<String> certifications = new ArrayList<>();
    private List<String> languages = new ArrayList<>();
    private List<String> publications = new ArrayList<>();
    private List<String> awards = new ArrayList<>();
    private List<ServiceDetailDTO> servicesDetails = new ArrayList<>();
    private List<CareLocationDTO> careLocations = new ArrayList<>();
    private List<String> gallery = new ArrayList<>();
    private List<ReviewDTO> reviews = new ArrayList<>();
    private List<AppointmentSummaryDTO> appointments = new ArrayList<>();
    private List<ScheduleDTO> schedule = new ArrayList<>();

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

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public Double getRating() {
        return rating;
    }

    public void setRating(Double rating) {
        this.rating = rating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getPhoto() {
        return photo;
    }

    public void setPhoto(String photo) {
        this.photo = photo;
    }

    public LocationDTO getLocation() {
        return location;
    }

    public void setLocation(LocationDTO location) {
        this.location = location;
    }

    public List<LocationDTO> getLocations() {
        return locations;
    }

    public void setLocations(List<LocationDTO> locations) {
        this.locations = locations != null ? locations : new ArrayList<>();
    }

    public List<String> getAvailability() {
        return availability;
    }

    public void setAvailability(List<String> availability) {
        this.availability = availability != null ? availability : new ArrayList<>();
    }

    public List<AvailabilityPreviewDTO> getAvailabilityPreview() {
        return availabilityPreview;
    }

    public void setAvailabilityPreview(List<AvailabilityPreviewDTO> availabilityPreview) {
        this.availabilityPreview = availabilityPreview != null ? availabilityPreview : new ArrayList<>();
    }

    public List<String> getConsultationTypes() {
        return consultationTypes;
    }

    public void setConsultationTypes(List<String> consultationTypes) {
        this.consultationTypes = consultationTypes != null ? consultationTypes : new ArrayList<>();
    }

    public List<String> getInsurance() {
        return insurance;
    }

    public void setInsurance(List<String> insurance) {
        this.insurance = insurance != null ? insurance : new ArrayList<>();
    }

    public List<String> getTitles() {
        return titles;
    }

    public void setTitles(List<String> titles) {
        this.titles = titles != null ? titles : new ArrayList<>();
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public List<String> getServices() {
        return services;
    }

    public void setServices(List<String> services) {
        this.services = services != null ? services : new ArrayList<>();
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public List<String> getDiseasesTreated() {
        return diseasesTreated;
    }

    public void setDiseasesTreated(List<String> diseasesTreated) {
        this.diseasesTreated = diseasesTreated != null ? diseasesTreated : new ArrayList<>();
    }

    public List<String> getPatientTypes() {
        return patientTypes;
    }

    public void setPatientTypes(List<String> patientTypes) {
        this.patientTypes = patientTypes != null ? patientTypes : new ArrayList<>();
    }

    public List<String> getEducation() {
        return education;
    }

    public void setEducation(List<String> education) {
        this.education = education != null ? education : new ArrayList<>();
    }

    public List<String> getCertifications() {
        return certifications;
    }

    public void setCertifications(List<String> certifications) {
        this.certifications = certifications != null ? certifications : new ArrayList<>();
    }

    public List<String> getLanguages() {
        return languages;
    }

    public void setLanguages(List<String> languages) {
        this.languages = languages != null ? languages : new ArrayList<>();
    }

    public List<String> getPublications() {
        return publications;
    }

    public void setPublications(List<String> publications) {
        this.publications = publications != null ? publications : new ArrayList<>();
    }

    public List<String> getAwards() {
        return awards;
    }

    public void setAwards(List<String> awards) {
        this.awards = awards != null ? awards : new ArrayList<>();
    }

    public List<ServiceDetailDTO> getServicesDetails() {
        return servicesDetails;
    }

    public void setServicesDetails(List<ServiceDetailDTO> servicesDetails) {
        this.servicesDetails = servicesDetails != null ? servicesDetails : new ArrayList<>();
    }

    public List<CareLocationDTO> getCareLocations() {
        return careLocations;
    }

    public void setCareLocations(List<CareLocationDTO> careLocations) {
        this.careLocations = careLocations != null ? careLocations : new ArrayList<>();
    }

    public List<String> getGallery() {
        return gallery;
    }

    public void setGallery(List<String> gallery) {
        this.gallery = gallery != null ? gallery : new ArrayList<>();
    }

    public List<ReviewDTO> getReviews() {
        return reviews;
    }

    public void setReviews(List<ReviewDTO> reviews) {
        this.reviews = reviews != null ? reviews : new ArrayList<>();
    }

    public List<AppointmentSummaryDTO> getAppointments() {
        return appointments;
    }

    public void setAppointments(List<AppointmentSummaryDTO> appointments) {
        this.appointments = appointments != null ? appointments : new ArrayList<>();
    }

    public List<ScheduleDTO> getSchedule() {
        return schedule;
    }

    public void setSchedule(List<ScheduleDTO> schedule) {
        this.schedule = schedule != null ? schedule : new ArrayList<>();
    }
}
