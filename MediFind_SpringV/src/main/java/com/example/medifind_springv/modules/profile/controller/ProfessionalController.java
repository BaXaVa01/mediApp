package com.example.medifind_springv.modules.profile.controller;

import com.example.medifind_springv.modules.profile.dto.ProfessionalProfileDTO;
import com.example.medifind_springv.modules.profile.service.ProfessionalService;
import com.example.medifind_springv.modules.profile.service.DoctorProfilePhotoService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.nio.file.Files;
import java.nio.file.Path;

@RestController
@RequestMapping("/api/professionals")
@CrossOrigin
public class ProfessionalController {

    private final ProfessionalService professionalService;
    private final DoctorProfilePhotoService photoService;

    public ProfessionalController(ProfessionalService professionalService, DoctorProfilePhotoService photoService) {
        this.professionalService = professionalService;
        this.photoService = photoService;
    }

    @GetMapping
    public ResponseEntity<List<ProfessionalProfileDTO>> getAllProfessionals() {
        return ResponseEntity.ok(professionalService.getAllProfessionals());
    }

    @GetMapping("/{doctorId}")
    public ResponseEntity<ProfessionalProfileDTO> getProfessionalById(@PathVariable String doctorId) {
        try {
            UUID id = UUID.fromString(doctorId);
            return professionalService.getProfessionalById(id)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<ProfessionalProfileDTO>> searchProfessionals(@RequestParam(required = false) String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(professionalService.getAllProfessionals());
        }
        return ResponseEntity.ok(professionalService.searchProfessionals(query));
    }

    @GetMapping("/{doctorId}/photo")
    public ResponseEntity<?> getDoctorPhoto(@PathVariable String doctorId) {
        UUID uuid;
        try {
            uuid = UUID.fromString(doctorId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("El doctorId no tiene un formato UUID válido.");
        }

        try {
            String dbFotoUrl = photoService.findCurrentPhotoUrl(uuid);
            if (dbFotoUrl == null || dbFotoUrl.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            String trimmed = dbFotoUrl.trim();
            if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
                return ResponseEntity.status(HttpStatus.FOUND)
                        .header(HttpHeaders.LOCATION, trimmed)
                        .build();
            }

            org.springframework.core.io.Resource resource = photoService.getDoctorPhotoResource(uuid);
            if (resource == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
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
}
