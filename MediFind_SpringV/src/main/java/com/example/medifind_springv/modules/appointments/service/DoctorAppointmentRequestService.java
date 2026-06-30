package com.example.medifind_springv.modules.appointments.service;

import com.example.medifind_springv.modules.appointments.dto.*;
import com.example.medifind_springv.modules.appointments.exception.AppointmentException;
import com.example.medifind_springv.modules.appointments.repository.DoctorAppointmentRequestRepository;
import com.example.medifind_springv.modules.appointments.repository.DoctorAppointmentRequestRepository.AppointmentRecord;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class DoctorAppointmentRequestService {

    private final DoctorAppointmentRequestRepository repository;

    public DoctorAppointmentRequestService(DoctorAppointmentRequestRepository repository) {
        this.repository = repository;
    }

    public PendingAppointmentsPageResponse getPendingAppointments(String doctorIdStr, Integer page, Integer size) {
        // 1. Validate page and size
        if (page == null || page < 0 || size == null || size < 1 || size > 50) {
            throw new AppointmentException("Los parámetros de paginación no son válidos.", HttpStatus.BAD_REQUEST, "INVALID_PAGINATION");
        }

        // 2. Validate doctorId format
        UUID doctorId;
        try {
            doctorId = UUID.fromString(doctorIdStr);
        } catch (IllegalArgumentException e) {
            throw new AppointmentException("El doctorId no tiene un formato UUID válido.", HttpStatus.BAD_REQUEST, "INVALID_DOCTOR_ID");
        }

        // 3. Validate doctor exists
        if (!repository.doctorExists(doctorId)) {
            throw new AppointmentException("El doctor indicado no existe.", HttpStatus.NOT_FOUND, "DOCTOR_NOT_FOUND");
        }

        String pendingStatus = "pendiente";
        int offset = page * size;

        // 4. Load counts and items
        long totalElements = repository.countPendingAppointments(doctorId, pendingStatus);
        List<PendingAppointmentDTO> items = repository.getPendingAppointments(doctorId, pendingStatus, size, offset);
        
        int totalPages = (int) Math.ceil((double) totalElements / size);

        return new PendingAppointmentsPageResponse(
                page,
                size,
                totalElements,
                totalPages,
                items
        );
    }

    @Transactional
    public AppointmentDecisionResponse updateDecision(String appointmentIdStr, AppointmentDecisionRequest request) {
        // 1. Validate appointmentId format
        UUID appointmentId;
        try {
            appointmentId = UUID.fromString(appointmentIdStr);
        } catch (IllegalArgumentException e) {
            throw new AppointmentException("El appointmentId no tiene un formato UUID válido.", HttpStatus.BAD_REQUEST, "INVALID_APPOINTMENT_ID");
        }

        // 2. Validate doctorId format
        UUID doctorId;
        try {
            doctorId = UUID.fromString(request.getDoctorId());
        } catch (IllegalArgumentException e) {
            throw new AppointmentException("El doctorId no tiene un formato UUID válido.", HttpStatus.BAD_REQUEST, "INVALID_DOCTOR_ID");
        }

        // 3. Validate decision
        String decision = request.getDecision();
        if (decision == null || (!"ACCEPT".equals(decision) && !"REJECT".equals(decision))) {
            throw new AppointmentException("La decisión debe ser ACCEPT o REJECT.", HttpStatus.BAD_REQUEST, "INVALID_DECISION");
        }

        // 4. Fetch appointment
        AppointmentRecord appt = repository.getAppointment(appointmentId);
        if (appt == null) {
            throw new AppointmentException("La cita indicada no existe.", HttpStatus.NOT_FOUND, "APPOINTMENT_NOT_FOUND");
        }

        // 5. Verify ownership
        if (!appt.doctorId.equals(doctorId)) {
            throw new AppointmentException("La cita no pertenece al doctor indicado.", HttpStatus.FORBIDDEN, "APPOINTMENT_NOT_OWNED_BY_DOCTOR");
        }

        // 6. Verify status is pending
        if (!"pendiente".equalsIgnoreCase(appt.estado)) {
            throw new AppointmentException("Solo se pueden aceptar o rechazar citas pendientes.", HttpStatus.BAD_REQUEST, "APPOINTMENT_NOT_PENDING");
        }

        // 7. Verify appointment is in the future
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        boolean isFuture = appt.fecha.isAfter(today) || (appt.fecha.equals(today) && appt.horaInicio.isAfter(now));
        if (!isFuture) {
            throw new AppointmentException("No se puede aceptar o rechazar una cita que ya pasó.", HttpStatus.BAD_REQUEST, "APPOINTMENT_ALREADY_PASSED");
        }

        // 8. Determine status
        String dbStatus;
        String responseStatus;
        String message;

        if ("ACCEPT".equals(decision)) {
            dbStatus = "confirmada";
            responseStatus = "Confirmada";
            message = "Cita aceptada correctamente";
        } else {
            // Note: PostgreSQL 'estado_cita' enum doesn't have 'rechazada', so we map to 'cancelada'
            dbStatus = "cancelada";
            responseStatus = "Cancelada";
            message = "Cita rechazada correctamente";
        }

        // 9. Persist update
        repository.updateAppointmentStatus(appointmentId, doctorId, dbStatus, request.getNotes(), LocalDateTime.now());

        return new AppointmentDecisionResponse(
                appointmentIdStr,
                responseStatus,
                message
        );
    }
}
