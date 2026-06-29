package com.example.medifind_springv.modules.auth.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class RegisterUserRequest {

    @NotBlank(message = "El tipo de cuenta es obligatorio")
    @Pattern(regexp = "^(PATIENT|DOCTOR)$", message = "El tipo de cuenta debe ser PATIENT o DOCTOR")
    private String accountType;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String name;

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El formato del correo es inválido")
    @Size(max = 100, message = "El correo no puede exceder los 100 caracteres")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, message = "La contraseña debe tener mínimo 8 caracteres")
    private String password;

    @Size(max = 30, message = "El teléfono no puede exceder los 30 caracteres")
    private String phone;

    // Patient Fields
    private String address;
    private String birthDate;
    private String gender;

    // Doctor Fields
    private String professionalName;

    @Size(max = 50, message = "El número de licencia no puede exceder los 50 caracteres")
    private String licenseNumber;

    private String bio;
    private String photoUrl;
    private List<String> specialtyIds = new ArrayList<>();
    private ExtraProfile extraProfile;

    public static class ExtraProfile {
        private List<String> insurance = new ArrayList<>();
        private List<String> consultationTypes = new ArrayList<>();
        private List<String> diseasesTreated = new ArrayList<>();
        private List<String> patientTypes = new ArrayList<>();
        private List<String> certifications = new ArrayList<>();
        private List<String> languages = new ArrayList<>();
        private List<String> publications = new ArrayList<>();
        private List<String> awards = new ArrayList<>();

        public List<String> getInsurance() {
            return insurance != null ? insurance : new ArrayList<>();
        }

        public void setInsurance(List<String> insurance) {
            this.insurance = insurance;
        }

        public List<String> getConsultationTypes() {
            return consultationTypes != null ? consultationTypes : new ArrayList<>();
        }

        public void setConsultationTypes(List<String> consultationTypes) {
            this.consultationTypes = consultationTypes;
        }

        public List<String> getDiseasesTreated() {
            return diseasesTreated != null ? diseasesTreated : new ArrayList<>();
        }

        public void setDiseasesTreated(List<String> diseasesTreated) {
            this.diseasesTreated = diseasesTreated;
        }

        public List<String> getPatientTypes() {
            return patientTypes != null ? patientTypes : new ArrayList<>();
        }

        public void setPatientTypes(List<String> patientTypes) {
            this.patientTypes = patientTypes;
        }

        public List<String> getCertifications() {
            return certifications != null ? certifications : new ArrayList<>();
        }

        public void setCertifications(List<String> certifications) {
            this.certifications = certifications;
        }

        public List<String> getLanguages() {
            return languages != null ? languages : new ArrayList<>();
        }

        public void setLanguages(List<String> languages) {
            this.languages = languages;
        }

        public List<String> getPublications() {
            return publications != null ? publications : new ArrayList<>();
        }

        public void setPublications(List<String> publications) {
            this.publications = publications;
        }

        public List<String> getAwards() {
            return awards != null ? awards : new ArrayList<>();
        }

        public void setAwards(List<String> awards) {
            this.awards = awards;
        }
    }

    @AssertTrue(message = "La contraseña debe tener al menos una letra y un número")
    public boolean isPasswordStrong() {
        if (password == null) return true;
        boolean hasLetter = false;
        boolean hasDigit = false;
        for (char c : password.toCharArray()) {
            if (Character.isLetter(c)) {
                hasLetter = true;
            } else if (Character.isDigit(c)) {
                hasDigit = true;
            }
            if (hasLetter && hasDigit) {
                return true;
            }
        }
        return false;
    }

    @AssertTrue(message = "El nombre profesional es obligatorio para doctores")
    public boolean isProfessionalNameValid() {
        if ("DOCTOR".equalsIgnoreCase(accountType)) {
            return professionalName != null && !professionalName.trim().isEmpty();
        }
        return true;
    }

    @AssertTrue(message = "La fecha de nacimiento no puede ser futura")
    public boolean isBirthDateValid() {
        if (birthDate != null && !birthDate.trim().isEmpty()) {
            try {
                LocalDate date = LocalDate.parse(birthDate);
                return !date.isAfter(LocalDate.now());
            } catch (Exception e) {
                return false;
            }
        }
        return true;
    }

    // Getters and Setters
    public String getAccountType() {
        return accountType;
    }

    public void setAccountType(String accountType) {
        this.accountType = accountType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(String birthDate) {
        this.birthDate = birthDate;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getProfessionalName() {
        return professionalName;
    }

    public void setProfessionalName(String professionalName) {
        this.professionalName = professionalName;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public List<String> getSpecialtyIds() {
        return specialtyIds != null ? specialtyIds : new ArrayList<>();
    }

    public void setSpecialtyIds(List<String> specialtyIds) {
        this.specialtyIds = specialtyIds;
    }

    public ExtraProfile getExtraProfile() {
        return extraProfile;
    }

    public void setExtraProfile(ExtraProfile extraProfile) {
        this.extraProfile = extraProfile;
    }
}
