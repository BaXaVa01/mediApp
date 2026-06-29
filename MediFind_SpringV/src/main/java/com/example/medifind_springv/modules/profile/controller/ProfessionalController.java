package com.example.medifind_springv.modules.profile.controller;

import com.example.medifind_springv.modules.profile.dto.ProfessionalProfileDTO;
import com.example.medifind_springv.modules.profile.service.ProfessionalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/professionals")
@CrossOrigin
public class ProfessionalController {

    private final ProfessionalService professionalService;

    public ProfessionalController(ProfessionalService professionalService) {
        this.professionalService = professionalService;
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
}
