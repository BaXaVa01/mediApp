package com.example.medifind_springv.modules.settings.controller;

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

    public DoctorScheduleSettingsController(DoctorScheduleSettingsService scheduleSettingsService) {
        this.scheduleSettingsService = scheduleSettingsService;
    }

    @GetMapping
    public ResponseEntity<DoctorScheduleResponse> getSchedule(@RequestParam String doctorId) {
        return ResponseEntity.ok(scheduleSettingsService.getDoctorSchedule(doctorId));
    }

    @PutMapping
    public ResponseEntity<DoctorScheduleResponse> replaceSchedule(@Valid @RequestBody ReplaceDoctorScheduleRequest request) {
        return ResponseEntity.ok(scheduleSettingsService.replaceDoctorSchedule(request));
    }
}
