package com.example.medifind_springv.modules.patient.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public class UpdatePatientProfileRequest {

    @NotBlank(message = "El patientId es obligatorio")
    private String patientId;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String name;

    @Size(max = 30, message = "El teléfono no puede exceder los 30 caracteres")
    private String phone;

    private String birthDate;

    @Pattern(regexp = "^(MALE|FEMALE|OTHER|NOT_SPECIFIED|masculino|femenino|otro|no_especificado)?$", 
             message = "El género debe ser MALE, FEMALE, OTHER o NOT_SPECIFIED")
    private String gender;

    @Size(max = 500, message = "La dirección no puede exceder los 500 caracteres")
    private String address;

    public UpdatePatientProfileRequest() {}

    @AssertTrue(message = "La fecha de nacimiento no puede ser futura")
    public boolean isBirthDateValid() {
        if (birthDate != null && !birthDate.trim().isEmpty()) {
            try {
                LocalDate date = LocalDate.parse(birthDate.trim());
                return !date.isAfter(LocalDate.now());
            } catch (Exception e) {
                return false;
            }
        }
        return true;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
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

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }
}
