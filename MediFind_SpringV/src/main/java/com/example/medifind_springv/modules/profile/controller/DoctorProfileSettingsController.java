package com.example.medifind_springv.modules.profile.controller;

import com.example.medifind_springv.config.AuthenticatedUser;
import com.example.medifind_springv.modules.profile.dto.*;
import com.example.medifind_springv.modules.profile.service.DoctorProfileSettingsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/doctor/profile")
@CrossOrigin
public class DoctorProfileSettingsController {

    private final DoctorProfileSettingsService profileSettingsService;
    private final AuthenticatedUser authenticatedUser;

    public DoctorProfileSettingsController(DoctorProfileSettingsService profileSettingsService, AuthenticatedUser authenticatedUser) {
        this.profileSettingsService = profileSettingsService;
        this.authenticatedUser = authenticatedUser;
    }

    @GetMapping("/settings")
    public ResponseEntity<DoctorEditableProfileResponse> getSettings(@RequestParam String doctorId) {
        authenticatedUser.verifyDoctorOwnership(doctorId);
        return ResponseEntity.ok(profileSettingsService.getDoctorEditableProfile(doctorId));
    }

    @PutMapping("/identity")
    public ResponseEntity<Map<String, Object>> updateIdentity(
            @Valid @RequestBody UpdateProfessionalIdentityRequest request) {
        authenticatedUser.verifyDoctorOwnership(request.getDoctorId());
        ProfessionalIdentityDTO updated = profileSettingsService.updateProfessionalIdentity(request);
        return ResponseEntity.ok(Map.of(
                "doctorId", request.getDoctorId(),
                "professionalIdentity", updated,
                "message", "Identidad profesional actualizada correctamente"
        ));
    }

    @PutMapping("/contact-visibility")
    public ResponseEntity<Map<String, Object>> updateContactVisibility(
            @Valid @RequestBody UpdateContactVisibilityRequest request) {
        authenticatedUser.verifyDoctorOwnership(request.getDoctorId());
        ContactVisibilityDTO updated = profileSettingsService.updateContactVisibility(request);
        return ResponseEntity.ok(Map.of(
                "doctorId", request.getDoctorId(),
                "contactVisibility", updated,
                "message", "Contacto y visibilidad actualizados correctamente"
        ));
    }

    @PostMapping("/education")
    public ResponseEntity<EducationDTO> createEducation(
            @Valid @RequestBody CreateEducationRequest request) {
        authenticatedUser.verifyDoctorOwnership(request.getDoctorId());
        EducationDTO response = profileSettingsService.createEducation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/education/{educationId}")
    public ResponseEntity<EducationDTO> updateEducation(
            @PathVariable String educationId,
            @Valid @RequestBody UpdateEducationRequest request) {
        authenticatedUser.verifyDoctorOwnership(request.getDoctorId());
        EducationDTO response = profileSettingsService.updateEducation(educationId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/education/{educationId}")
    public ResponseEntity<Map<String, String>> deleteEducation(
            @PathVariable String educationId,
            @RequestParam String doctorId) {
        authenticatedUser.verifyDoctorOwnership(doctorId);
        profileSettingsService.deleteEducation(educationId, doctorId);
        return ResponseEntity.ok(Map.of(
                "id", educationId,
                "message", "Formación académica eliminada correctamente"
        ));
    }

    @PostMapping("/experience")
    public ResponseEntity<ExperienceDTO> createExperience(
            @Valid @RequestBody CreateExperienceRequest request) {
        authenticatedUser.verifyDoctorOwnership(request.getDoctorId());
        ExperienceDTO response = profileSettingsService.createExperience(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/experience/{experienceId}")
    public ResponseEntity<ExperienceDTO> updateExperience(
            @PathVariable String experienceId,
            @Valid @RequestBody UpdateExperienceRequest request) {
        authenticatedUser.verifyDoctorOwnership(request.getDoctorId());
        ExperienceDTO response = profileSettingsService.updateExperience(experienceId, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/experience/{experienceId}")
    public ResponseEntity<Map<String, String>> deleteExperience(
            @PathVariable String experienceId,
            @RequestParam String doctorId) {
        authenticatedUser.verifyDoctorOwnership(doctorId);
        profileSettingsService.deleteExperience(experienceId, doctorId);
        return ResponseEntity.ok(Map.of(
                "id", experienceId,
                "message", "Experiencia profesional eliminada correctamente"
        ));
    }
}
