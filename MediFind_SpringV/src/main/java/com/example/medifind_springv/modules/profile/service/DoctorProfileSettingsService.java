package com.example.medifind_springv.modules.profile.service;

import com.example.medifind_springv.modules.appointments.exception.AppointmentException;
import com.example.medifind_springv.modules.profile.dto.*;
import com.example.medifind_springv.modules.profile.exception.*;
import com.example.medifind_springv.modules.profile.repository.DoctorProfileSettingsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class DoctorProfileSettingsService {

    private final DoctorProfileSettingsRepository repository;

    public DoctorProfileSettingsService(DoctorProfileSettingsRepository repository) {
        this.repository = repository;
    }

    public DoctorEditableProfileResponse getDoctorEditableProfile(String doctorIdStr) {
        UUID doctorId = parseUuid(doctorIdStr);
        validateDoctorExists(doctorId);

        ProfessionalIdentityDTO identity = repository.getProfessionalIdentity(doctorId);
        ContactVisibilityDTO visibility = repository.getContactVisibility(doctorId);
        List<EducationDTO> education = repository.getEducation(doctorId);
        List<ExperienceDTO> experience = repository.getExperience(doctorId);
        String photoUrl = repository.getDoctorPhotoUrl(doctorId);

        return new DoctorEditableProfileResponse(doctorIdStr, photoUrl, identity, visibility, education, experience);
    }

    @Transactional
    public ProfessionalIdentityDTO updateProfessionalIdentity(UpdateProfessionalIdentityRequest request) {
        UUID doctorId = parseUuid(request.getDoctorId());
        validateDoctorExists(doctorId);

        // Validation checks
        if (request.getPublicName() == null || request.getPublicName().trim().length() < 2 || request.getPublicName().trim().length() > 120) {
            throw new ProfileValidationException("Datos inválidos.", Map.of("publicName", "El nombre público debe tener entre 2 y 120 caracteres."));
        }

        if (request.getYearsOfExperience() != null) {
            if (request.getYearsOfExperience() < 0 || request.getYearsOfExperience() > 80) {
                throw new ProfileValidationException("Datos inválidos.", Map.of("yearsOfExperience", "Los años de experiencia deben estar entre 0 y 80."));
            }
        }

        UUID specialtyId = null;
        if (request.getMainSpecialtyId() != null && !request.getMainSpecialtyId().trim().isEmpty()) {
            try {
                specialtyId = UUID.fromString(request.getMainSpecialtyId().trim());
            } catch (IllegalArgumentException e) {
                throw new AppointmentException("La especialidad indicada no existe.", HttpStatus.BAD_REQUEST, "INVALID_SPECIALTY");
            }
            if (!repository.specialtyExists(specialtyId)) {
                throw new AppointmentException("La especialidad indicada no existe.", HttpStatus.BAD_REQUEST, "INVALID_SPECIALTY");
            }
        }

        // Update doctor table
        repository.updateProfessionalIdentity(
                doctorId,
                request.getPublicName().trim(),
                request.getHeadline() != null ? request.getHeadline().trim() : "",
                request.getBio() != null ? request.getBio().trim() : "",
                request.getYearsOfExperience() != null ? request.getYearsOfExperience() : 0,
                LocalDateTime.now()
        );

        // Manage main specialty relation
        if (specialtyId != null) {
            repository.deleteDoctorSpecialties(doctorId);
            repository.insertDoctorSpecialty(UUID.randomUUID(), doctorId, specialtyId);
        }

        return repository.getProfessionalIdentity(doctorId);
    }

    @Transactional
    public ContactVisibilityDTO updateContactVisibility(UpdateContactVisibilityRequest request) {
        UUID doctorId = parseUuid(request.getDoctorId());
        validateDoctorExists(doctorId);

        // Validation checks
        if (request.getPublicEmail() != null && !request.getPublicEmail().trim().isEmpty()) {
            if (request.getPublicEmail().length() > 150) {
                throw new ProfileValidationException("Datos inválidos.", Map.of("publicEmail", "El correo público no puede exceder los 150 caracteres."));
            }
        }

        repository.updateContactVisibility(
                doctorId,
                request.getPublicPhone() != null ? request.getPublicPhone().trim() : "",
                request.getPublicEmail() != null ? request.getPublicEmail().trim() : "",
                request.getCity() != null ? request.getCity().trim() : "",
                request.getLocationSummary() != null ? request.getLocationSummary().trim() : "",
                request.getProfileVisible() != null ? request.getProfileVisible() : false,
                request.getOnlineConsultationAvailable() != null ? request.getOnlineConsultationAvailable() : false,
                LocalDateTime.now()
        );

        return repository.getContactVisibility(doctorId);
    }

    // Education Operations

    @Transactional
    public EducationDTO createEducation(CreateEducationRequest request) {
        UUID doctorId = parseUuid(request.getDoctorId());
        validateDoctorExists(doctorId);

        validateYears(request.getStartYear(), request.getEndYear());

        UUID id = UUID.randomUUID();
        repository.insertEducation(
                id,
                doctorId,
                request.getTitle().trim(),
                request.getInstitution().trim(),
                request.getStartYear(),
                request.getEndYear(),
                request.getDescription() != null ? request.getDescription().trim() : ""
        );

        return new EducationDTO(
                id.toString(),
                request.getTitle().trim(),
                request.getInstitution().trim(),
                request.getStartYear(),
                request.getEndYear(),
                request.getDescription() != null ? request.getDescription().trim() : ""
        );
    }

    @Transactional
    public EducationDTO updateEducation(String educationIdStr, UpdateEducationRequest request) {
        UUID doctorId = parseUuid(request.getDoctorId());
        UUID educationId = parseUuid(educationIdStr);
        validateDoctorExists(doctorId);

        validateYears(request.getStartYear(), request.getEndYear());

        DoctorProfileSettingsRepository.DbEducation existing = repository.findEducationById(educationId);
        if (existing == null) {
            throw new EducationNotFoundException("La formación académica indicada no existe.");
        }

        if (!existing.doctorId.equals(doctorId)) {
            throw new AppointmentException("El recurso no pertenece al doctor indicado.", HttpStatus.FORBIDDEN, "RESOURCE_NOT_OWNED_BY_DOCTOR");
        }

        repository.updateEducation(
                educationId,
                request.getTitle().trim(),
                request.getInstitution().trim(),
                request.getStartYear(),
                request.getEndYear(),
                request.getDescription() != null ? request.getDescription().trim() : ""
        );

        return new EducationDTO(
                educationIdStr,
                request.getTitle().trim(),
                request.getInstitution().trim(),
                request.getStartYear(),
                request.getEndYear(),
                request.getDescription() != null ? request.getDescription().trim() : ""
        );
    }

    @Transactional
    public void deleteEducation(String educationIdStr, String doctorIdStr) {
        UUID doctorId = parseUuid(doctorIdStr);
        UUID educationId = parseUuid(educationIdStr);
        validateDoctorExists(doctorId);

        DoctorProfileSettingsRepository.DbEducation existing = repository.findEducationById(educationId);
        if (existing == null) {
            throw new EducationNotFoundException("La formación académica indicada no existe.");
        }

        if (!existing.doctorId.equals(doctorId)) {
            throw new AppointmentException("El recurso no pertenece al doctor indicado.", HttpStatus.FORBIDDEN, "RESOURCE_NOT_OWNED_BY_DOCTOR");
        }

        repository.deleteEducation(educationId);
    }

    // Experience Operations

    @Transactional
    public ExperienceDTO createExperience(CreateExperienceRequest request) {
        UUID doctorId = parseUuid(request.getDoctorId());
        validateDoctorExists(doctorId);

        validateYears(request.getStartYear(), request.getEndYear());

        UUID id = UUID.randomUUID();
        repository.insertExperience(
                id,
                doctorId,
                request.getPosition().trim(),
                request.getInstitution().trim(),
                request.getStartYear(),
                request.getEndYear(),
                request.getDescription() != null ? request.getDescription().trim() : ""
        );

        return new ExperienceDTO(
                id.toString(),
                request.getPosition().trim(),
                request.getInstitution().trim(),
                request.getStartYear(),
                request.getEndYear(),
                request.getDescription() != null ? request.getDescription().trim() : ""
        );
    }

    @Transactional
    public ExperienceDTO updateExperience(String experienceIdStr, UpdateExperienceRequest request) {
        UUID doctorId = parseUuid(request.getDoctorId());
        UUID experienceId = parseUuid(experienceIdStr);
        validateDoctorExists(doctorId);

        validateYears(request.getStartYear(), request.getEndYear());

        DoctorProfileSettingsRepository.DbExperience existing = repository.findExperienceById(experienceId);
        if (existing == null) {
            throw new ExperienceNotFoundException("La experiencia profesional indicada no existe.");
        }

        if (!existing.doctorId.equals(doctorId)) {
            throw new AppointmentException("El recurso no pertenece al doctor indicado.", HttpStatus.FORBIDDEN, "RESOURCE_NOT_OWNED_BY_DOCTOR");
        }

        repository.updateExperience(
                experienceId,
                request.getPosition().trim(),
                request.getInstitution().trim(),
                request.getStartYear(),
                request.getEndYear(),
                request.getDescription() != null ? request.getDescription().trim() : ""
        );

        return new ExperienceDTO(
                experienceIdStr,
                request.getPosition().trim(),
                request.getInstitution().trim(),
                request.getStartYear(),
                request.getEndYear(),
                request.getDescription() != null ? request.getDescription().trim() : ""
        );
    }

    @Transactional
    public void deleteExperience(String experienceIdStr, String doctorIdStr) {
        UUID doctorId = parseUuid(doctorIdStr);
        UUID experienceId = parseUuid(experienceIdStr);
        validateDoctorExists(doctorId);

        DoctorProfileSettingsRepository.DbExperience existing = repository.findExperienceById(experienceId);
        if (existing == null) {
            throw new ExperienceNotFoundException("La experiencia profesional indicada no existe.");
        }

        if (!existing.doctorId.equals(doctorId)) {
            throw new AppointmentException("El recurso no pertenece al doctor indicado.", HttpStatus.FORBIDDEN, "RESOURCE_NOT_OWNED_BY_DOCTOR");
        }

        repository.deleteExperience(experienceId);
    }

    // Helper Methods

    private UUID parseUuid(String uuidStr) {
        try {
            return UUID.fromString(uuidStr);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new AppointmentException("El identificador enviado no tiene formato UUID válido.", HttpStatus.BAD_REQUEST, "INVALID_UUID");
        }
    }

    private void validateDoctorExists(UUID doctorId) {
        if (!repository.doctorExists(doctorId)) {
            throw new DoctorNotFoundException("El doctor indicado no existe.");
        }
    }

    private void validateYears(Integer startYear, Integer endYear) {
        int currentYear = java.time.LocalDate.now().getYear();
        Map<String, String> errors = new java.util.HashMap<>();

        if (startYear != null) {
            if (startYear < 1900 || startYear > currentYear + 1) {
                errors.put("startYear", "El año de inicio debe estar entre 1900 y " + (currentYear + 1) + ".");
            }
        }

        if (endYear != null) {
            if (endYear < 1900 || endYear > currentYear + 10) {
                errors.put("endYear", "El año de fin debe estar entre 1900 y " + (currentYear + 10) + ".");
            }
        }

        if (startYear != null && endYear != null) {
            if (endYear < startYear) {
                errors.put("endYear", "El año de fin no puede ser menor al año de inicio");
            }
        }

        if (!errors.isEmpty()) {
            throw new ProfileValidationException("Datos inválidos.", errors);
        }
    }
}
