package com.example.medifind_springv.modules.appointments.service;

import com.example.medifind_springv.modules.appointments.dto.DoctorCalendarAppointmentDTO;
import com.example.medifind_springv.modules.appointments.dto.DoctorWeeklyCalendarResponse;
import com.example.medifind_springv.modules.appointments.exception.AppointmentException;
import com.example.medifind_springv.modules.appointments.repository.DoctorAppointmentCalendarRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.UUID;

@Service
public class DoctorAppointmentCalendarService {

    private final DoctorAppointmentCalendarRepository repository;

    public DoctorAppointmentCalendarService(DoctorAppointmentCalendarRepository repository) {
        this.repository = repository;
    }

    public DoctorWeeklyCalendarResponse getWeeklyCalendar(String doctorIdStr, String weekStartStr) {
        // 1. Validate doctorId UUID format
        UUID doctorId;
        try {
            doctorId = UUID.fromString(doctorIdStr);
        } catch (IllegalArgumentException e) {
            throw new AppointmentException("El doctorId no tiene un formato UUID válido.", HttpStatus.BAD_REQUEST, "INVALID_DOCTOR_ID");
        }

        // 2. Validate weekStart parameter
        if (weekStartStr == null || weekStartStr.trim().isEmpty()) {
            throw new AppointmentException("weekStart debe tener formato yyyy-MM-dd.", HttpStatus.BAD_REQUEST, "INVALID_WEEK_START");
        }

        LocalDate inputDate;
        try {
            inputDate = LocalDate.parse(weekStartStr.trim());
        } catch (DateTimeParseException e) {
            throw new AppointmentException("weekStart debe tener formato yyyy-MM-dd.", HttpStatus.BAD_REQUEST, "INVALID_WEEK_START");
        }

        // 3. Validate doctor exists
        if (!repository.doctorExists(doctorId)) {
            throw new AppointmentException("El doctor indicado no existe.", HttpStatus.NOT_FOUND, "DOCTOR_NOT_FOUND");
        }

        // 4. Calculate monday and sunday of the week
        LocalDate weekStart = inputDate.with(DayOfWeek.MONDAY);
        LocalDate weekEnd = inputDate.with(DayOfWeek.SUNDAY);

        // 5. Fetch appointments
        List<DoctorCalendarAppointmentDTO> appointments = repository.getWeeklyAppointments(doctorId, weekStart, weekEnd);

        return new DoctorWeeklyCalendarResponse(
                doctorIdStr,
                weekStart.toString(),
                weekEnd.toString(),
                appointments
        );
    }
}
