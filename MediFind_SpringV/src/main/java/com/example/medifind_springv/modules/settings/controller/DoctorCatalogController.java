package com.example.medifind_springv.modules.settings.controller;

import com.example.medifind_springv.modules.settings.dto.*;
import com.example.medifind_springv.modules.settings.service.DoctorServiceSettingsService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctor/services")
@CrossOrigin
public class DoctorCatalogController {

    private final DoctorServiceSettingsService serviceSettingsService;

    public DoctorCatalogController(DoctorServiceSettingsService serviceSettingsService) {
        this.serviceSettingsService = serviceSettingsService;
    }

    @GetMapping
    public ResponseEntity<DoctorServicesListResponse> listServices(
            @RequestParam String doctorId,
            @RequestParam(defaultValue = "false") boolean includeInactive) {
        return ResponseEntity.ok(serviceSettingsService.listServices(doctorId, includeInactive));
    }

    @GetMapping("/{serviceId}")
    public ResponseEntity<DoctorServiceResponse> getServiceDetail(
            @PathVariable String serviceId,
            @RequestParam String doctorId) {
        return ResponseEntity.ok(serviceSettingsService.getServiceDetail(doctorId, serviceId));
    }

    @PostMapping
    public ResponseEntity<DoctorServiceResponse> createService(
            @Valid @RequestBody CreateDoctorServiceRequest request) {
        DoctorServiceResponse response = serviceSettingsService.createService(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{serviceId}")
    public ResponseEntity<DoctorServiceResponse> updateService(
            @PathVariable String serviceId,
            @Valid @RequestBody UpdateDoctorServiceRequest request) {
        return ResponseEntity.ok(serviceSettingsService.updateService(serviceId, request));
    }

    @DeleteMapping("/{serviceId}")
    public ResponseEntity<DeleteDoctorServiceResponse> softDeleteService(
            @PathVariable String serviceId,
            @RequestParam String doctorId) {
        return ResponseEntity.ok(serviceSettingsService.softDeleteService(serviceId, doctorId));
    }
}
