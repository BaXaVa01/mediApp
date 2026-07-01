package com.example.medifind_springv.modules.settings.controller;

import com.example.medifind_springv.config.AuthenticatedUser;
import com.example.medifind_springv.modules.settings.dto.*;
import com.example.medifind_springv.modules.settings.service.DoctorLocationSettingsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/doctor/locations")
@CrossOrigin
public class DoctorLocationSettingsController {

    private final DoctorLocationSettingsService locationSettingsService;
    private final AuthenticatedUser authenticatedUser;

    public DoctorLocationSettingsController(DoctorLocationSettingsService locationSettingsService, AuthenticatedUser authenticatedUser) {
        this.locationSettingsService = locationSettingsService;
        this.authenticatedUser = authenticatedUser;
    }

    @PostMapping
    public ResponseEntity<DoctorLocationResponse> createLocation(
            @Valid @RequestBody CreateDoctorLocationRequest request) {
        authenticatedUser.verifyDoctorOwnership(request.getDoctorId());
        DoctorLocationResponse response = locationSettingsService.createLocation(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{locationId}")
    public ResponseEntity<DoctorLocationResponse> updateLocation(
            @PathVariable String locationId,
            @Valid @RequestBody UpdateDoctorLocationRequest request) {
        authenticatedUser.verifyDoctorOwnership(request.getDoctorId());
        return ResponseEntity.ok(locationSettingsService.updateLocation(locationId, request));
    }

    @DeleteMapping("/{locationId}")
    public ResponseEntity<DeleteDoctorLocationResponse> softDeleteLocation(
            @PathVariable String locationId,
            @RequestParam String doctorId) {
        authenticatedUser.verifyDoctorOwnership(doctorId);
        return ResponseEntity.ok(locationSettingsService.softDeleteLocation(locationId, doctorId));
    }

    @PatchMapping("/{locationId}/main")
    public ResponseEntity<Map<String, Object>> setMainLocation(
            @PathVariable String locationId,
            @Valid @RequestBody SetMainLocationRequest request) {
        authenticatedUser.verifyDoctorOwnership(request.getDoctorId());
        DoctorLocationResponse response = locationSettingsService.setMainLocation(locationId, request.getDoctorId());
        return ResponseEntity.ok(Map.of(
                "id", response.getId(),
                "doctorId", request.getDoctorId(),
                "isMain", true,
                "message", "Lugar principal actualizado correctamente"
                // TODO: En el futuro, resolver doctorId directamente desde el token en vez de recibirlo en el body
        ));
    }
}
