package com.example.medifind_springv.modules.appointments.controller;

import com.example.medifind_springv.modules.appointments.dto.AppointmentAvailabilityResponse;
import com.example.medifind_springv.modules.appointments.dto.CreateAppointmentRequest;
import com.example.medifind_springv.modules.appointments.dto.CreateAppointmentResponse;
import com.example.medifind_springv.modules.appointments.exception.AppointmentException;
import com.example.medifind_springv.modules.appointments.service.AppointmentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/availability")
    public ResponseEntity<AppointmentAvailabilityResponse> getAvailability(
            @RequestParam String doctorId,
            @RequestParam String date,
            @RequestParam(required = false) String serviceId,
            @RequestParam(required = false) String locationId) {
        try {
            UUID docUUID = UUID.fromString(doctorId);
            LocalDate localDate = LocalDate.parse(date);
            UUID serviceUUID = (serviceId != null && !serviceId.trim().isEmpty()) ? UUID.fromString(serviceId) : null;
            UUID locationUUID = (locationId != null && !locationId.trim().isEmpty()) ? UUID.fromString(locationId) : null;

            AppointmentAvailabilityResponse response = appointmentService.getAvailability(docUUID, localDate, serviceUUID, locationUUID);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException | java.time.format.DateTimeParseException e) {
            throw new AppointmentException(
                    "Formato de parámetros inválido. Asegúrese de enviar UUIDs válidos y fecha en formato YYYY-MM-DD.",
                    HttpStatus.BAD_REQUEST,
                    "VALIDATION_ERROR"
            );
        }
    }

    @PostMapping
    public ResponseEntity<CreateAppointmentResponse> createAppointment(@Valid @RequestBody CreateAppointmentRequest request) {
        CreateAppointmentResponse response = appointmentService.createAppointment(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
