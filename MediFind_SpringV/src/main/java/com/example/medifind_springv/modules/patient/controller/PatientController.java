package com.example.medifind_springv.modules.patient.controller;

import com.example.medifind_springv.config.AuthenticatedUser;
import com.example.medifind_springv.config.AuthenticatedUserPrincipal;
import com.example.medifind_springv.modules.patient.dto.*;
import com.example.medifind_springv.modules.patient.service.PatientService;
import com.example.medifind_springv.modules.patient.service.RecentDoctorService;
import jakarta.validation.Valid;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@CrossOrigin
public class PatientController {

    private final PatientService patientService;
    private final RecentDoctorService recentDoctorService;
    private final AuthenticatedUser authenticatedUser;

    public PatientController(PatientService patientService, RecentDoctorService recentDoctorService, AuthenticatedUser authenticatedUser) {
        this.patientService = patientService;
        this.recentDoctorService = recentDoctorService;
        this.authenticatedUser = authenticatedUser;
    }

    private void verifyOwnership(String patientId) {
        AuthenticatedUserPrincipal principal = authenticatedUser.getPrincipal();
        boolean isAdmin = "admin".equalsIgnoreCase(principal.getRole()) || "ROLE_ADMIN".equalsIgnoreCase(principal.getRole());
        if (!isAdmin) {
            authenticatedUser.verifyPatientOwnership(patientId);
        }
    }

    @GetMapping("/api/patient/profile")
    public ResponseEntity<PatientProfileResponse> getProfile(@RequestParam String patientId) {
        verifyOwnership(patientId);
        return ResponseEntity.ok(patientService.getPatientProfile(patientId));
    }

    @PutMapping("/api/patient/profile")
    public ResponseEntity<PatientProfileResponse> updateProfile(@Valid @RequestBody UpdatePatientProfileRequest request) {
        verifyOwnership(request.getPatientId());
        return ResponseEntity.ok(patientService.updatePatientProfile(request));
    }

    @PostMapping("/api/patient/profile/photo")
    public ResponseEntity<PatientProfilePhotoResponse> uploadPhoto(
            @RequestParam String patientId,
            @RequestParam("file") MultipartFile file) {
        verifyOwnership(patientId);
        return ResponseEntity.ok(patientService.uploadProfilePhoto(patientId, file));
    }

    @GetMapping("/api/patients/{patientId}/photo")
    public ResponseEntity<?> getPhoto(@PathVariable String patientId) {
        try {
            Resource resource = patientService.getPatientPhotoResource(patientId);
            if (resource == null) {
                return ResponseEntity.notFound().build();
            }

            String contentType = "image/jpeg";
            try {
                Path path = resource.getFile().toPath();
                contentType = Files.probeContentType(path);
                if (contentType == null) {
                    String filename = path.getFileName().toString().toLowerCase();
                    if (filename.endsWith(".png")) {
                        contentType = "image/png";
                    } else if (filename.endsWith(".webp")) {
                        contentType = "image/webp";
                    } else {
                        contentType = "image/jpeg";
                    }
                }
            } catch (Exception ignored) {}

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .header(HttpHeaders.CACHE_CONTROL, "public, max-age=3600")
                    .body(resource);

        } catch (com.example.medifind_springv.modules.appointments.exception.AppointmentException e) {
            if (e.getStatus() == HttpStatus.NOT_FOUND) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
            return ResponseEntity.status(e.getStatus()).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/api/patient/appointments")
    public ResponseEntity<PatientAppointmentsPageResponse> getAppointments(
            @RequestParam String patientId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        verifyOwnership(patientId);
        return ResponseEntity.ok(patientService.getPatientAppointments(patientId, status, page, size));
    }

    @PatchMapping("/api/patient/appointments/{appointmentId}/cancel")
    public ResponseEntity<CancelPatientAppointmentResponse> cancelAppointment(
            @PathVariable String appointmentId,
            @Valid @RequestBody CancelPatientAppointmentRequest request) {
        verifyOwnership(request.getPatientId());
        return ResponseEntity.ok(patientService.cancelAppointment(appointmentId, request));
    }

    @PostMapping("/api/patient/recent-doctors")
    public ResponseEntity<RecentDoctorResponse> recordRecentDoctor(@Valid @RequestBody RecordRecentDoctorRequest request) {
        verifyOwnership(request.getPatientId());
        return ResponseEntity.ok(recentDoctorService.recordView(request));
    }

    @GetMapping("/api/patient/recent-doctors")
    public ResponseEntity<RecentDoctorsListResponse> getRecentDoctors(
            @RequestParam String patientId,
            @RequestParam(defaultValue = "10") int limit) {
        verifyOwnership(patientId);
        return ResponseEntity.ok(recentDoctorService.getRecentDoctors(patientId, limit));
    }
}
