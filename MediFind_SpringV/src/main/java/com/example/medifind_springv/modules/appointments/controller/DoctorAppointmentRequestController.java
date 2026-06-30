package com.example.medifind_springv.modules.appointments.controller;

import com.example.medifind_springv.modules.appointments.dto.AppointmentDecisionRequest;
import com.example.medifind_springv.modules.appointments.dto.AppointmentDecisionResponse;
import com.example.medifind_springv.modules.appointments.dto.PendingAppointmentsPageResponse;
import com.example.medifind_springv.modules.appointments.service.DoctorAppointmentRequestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/doctor/appointments")
@CrossOrigin
public class DoctorAppointmentRequestController {

    private final DoctorAppointmentRequestService requestService;

    public DoctorAppointmentRequestController(DoctorAppointmentRequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping("/pending")
    public ResponseEntity<PendingAppointmentsPageResponse> getPendingAppointments(
            @RequestParam String doctorId,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        return ResponseEntity.ok(requestService.getPendingAppointments(doctorId, page, size));
    }

    @PatchMapping("/{appointmentId}/decision")
    public ResponseEntity<AppointmentDecisionResponse> updateDecision(
            @PathVariable String appointmentId,
            @Valid @RequestBody AppointmentDecisionRequest request) {
        return ResponseEntity.ok(requestService.updateDecision(appointmentId, request));
    }
}
