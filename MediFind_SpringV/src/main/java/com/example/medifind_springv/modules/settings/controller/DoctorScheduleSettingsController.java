package com.example.medifind_springv.modules.settings.controller;

import com.example.medifind_springv.config.AuthenticatedUser;
import com.example.medifind_springv.modules.settings.dto.DoctorScheduleResponse;
import com.example.medifind_springv.modules.settings.dto.ReplaceDoctorScheduleRequest;
import com.example.medifind_springv.modules.settings.service.DoctorScheduleSettingsService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctor/settings/schedule")
@CrossOrigin
public class DoctorScheduleSettingsController {

    private final DoctorScheduleSettingsService scheduleSettingsService;
    private final AuthenticatedUser authenticatedUser;

    public DoctorScheduleSettingsController(DoctorScheduleSettingsService scheduleSettingsService, AuthenticatedUser authenticatedUser) {
        this.scheduleSettingsService = scheduleSettingsService;
        this.authenticatedUser = authenticatedUser;
    }

    @GetMapping
    public ResponseEntity<DoctorScheduleResponse> getSchedule(@RequestParam String doctorId) {
        authenticatedUser.verifyDoctorOwnership(doctorId);
        return ResponseEntity.ok(scheduleSettingsService.getDoctorSchedule(doctorId));
    }

    @PutMapping
    public ResponseEntity<DoctorScheduleResponse> replaceSchedule(@Valid @RequestBody ReplaceDoctorScheduleRequest request) {
        authenticatedUser.verifyDoctorOwnership(request.getDoctorId());
        return ResponseEntity.ok(scheduleSettingsService.replaceDoctorSchedule(request));
    }
}
