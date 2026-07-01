package com.example.medifind_springv.modules.appointments.controller;

import com.example.medifind_springv.config.AuthenticatedUser;
import com.example.medifind_springv.modules.appointments.dto.DoctorWeeklyCalendarResponse;
import com.example.medifind_springv.modules.appointments.service.DoctorAppointmentCalendarService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class DoctorAppointmentCalendarController {

    private final DoctorAppointmentCalendarService calendarService;
    private final AuthenticatedUser authenticatedUser;

    public DoctorAppointmentCalendarController(DoctorAppointmentCalendarService calendarService, AuthenticatedUser authenticatedUser) {
        this.calendarService = calendarService;
        this.authenticatedUser = authenticatedUser;
    }

    @GetMapping("/api/doctors/{doctorId}/appointments/calendar")
    public ResponseEntity<DoctorWeeklyCalendarResponse> getCalendarByPath(
            @PathVariable String doctorId,
            @RequestParam String weekStart) {
        authenticatedUser.verifyDoctorOwnership(doctorId);
        return ResponseEntity.ok(calendarService.getWeeklyCalendar(doctorId, weekStart));
    }

    @GetMapping("/api/doctor/appointments/calendar")
    public ResponseEntity<DoctorWeeklyCalendarResponse> getCalendarByQuery(
            @RequestParam String doctorId,
            @RequestParam String weekStart) {
        authenticatedUser.verifyDoctorOwnership(doctorId);
        return ResponseEntity.ok(calendarService.getWeeklyCalendar(doctorId, weekStart));
    }
}
