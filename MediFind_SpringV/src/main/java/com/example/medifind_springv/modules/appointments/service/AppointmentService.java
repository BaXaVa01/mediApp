package com.example.medifind_springv.modules.appointments.service;

import com.example.medifind_springv.modules.appointments.dto.AppointmentAvailabilityResponse;
import com.example.medifind_springv.modules.appointments.dto.AppointmentSlotDTO;
import com.example.medifind_springv.modules.appointments.dto.CreateAppointmentRequest;
import com.example.medifind_springv.modules.appointments.dto.CreateAppointmentResponse;
import com.example.medifind_springv.modules.appointments.exception.*;
import com.example.medifind_springv.modules.appointments.repository.AppointmentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public AppointmentAvailabilityResponse getAvailability(UUID doctorId, LocalDate date, UUID serviceId, UUID locationId) {
        // Validate doctor exists
        if (!appointmentRepository.doctorExists(doctorId)) {
            throw new AppointmentNotFoundException("El doctor indicado no existe.", HttpStatus.NOT_FOUND, "DOCTOR_NOT_FOUND");
        }

        AppointmentRepository.ServiceEntity service = null;
        if (serviceId != null) {
            service = appointmentRepository.getActiveService(serviceId);
            if (service == null) {
                throw new AppointmentException("El servicio indicado no existe o no está activo.", HttpStatus.BAD_REQUEST, "INVALID_SERVICE");
            }
        }

        if (locationId != null) {
            if (appointmentRepository.getActiveLocation(locationId) == null) {
                throw new AppointmentException("El lugar de atención indicado no existe o no está activo.", HttpStatus.BAD_REQUEST, "INVALID_LOCATION");
            }
        }

        int dayOfWeek = date.getDayOfWeek().getValue(); // 1 = Monday, ..., 7 = Sunday
        List<AppointmentRepository.ScheduleEntity> schedules = appointmentRepository.getActiveSchedules(doctorId, locationId, dayOfWeek);

        List<AppointmentSlotDTO> slots = new ArrayList<>();
        if (schedules.isEmpty()) {
            return new AppointmentAvailabilityResponse(
                    doctorId.toString(),
                    date.toString(),
                    serviceId != null ? serviceId.toString() : null,
                    locationId != null ? locationId.toString() : null,
                    slots
            );
        }

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        // Get existing appointments and blocks to filter them out
        List<AppointmentRepository.TimeRange> appts = appointmentRepository.getExistingAppointments(doctorId, date);
        List<AppointmentRepository.BlockEntity> blocks = appointmentRepository.getDisponibilidadBloqueos(doctorId, date, locationId);

        for (AppointmentRepository.ScheduleEntity s : schedules) {
            int slotDuration = (service != null) ? service.duracionMinutos : (s.duracionCitaMinutos > 0 ? s.duracionCitaMinutos : 30);
            LocalTime tempTime = s.horaInicio;

            while (tempTime.plusMinutes(slotDuration).compareTo(s.horaFin) <= 0) {
                LocalTime slotStart = tempTime;
                LocalTime slotEnd = tempTime.plusMinutes(slotDuration);

                // Exclude past slots if date is today
                if (date.equals(today) && slotStart.compareTo(now) <= 0) {
                    tempTime = slotEnd;
                    continue;
                }

                // Check overlap with existing appointments
                boolean apptOverlap = false;
                for (AppointmentRepository.TimeRange a : appts) {
                    if (slotStart.isBefore(a.endTime) && slotEnd.isAfter(a.startTime)) {
                        apptOverlap = true;
                        break;
                    }
                }

                // Check overlap with blockages
                boolean blockOverlap = false;
                for (AppointmentRepository.BlockEntity b : blocks) {
                    if (slotStart.isBefore(b.horaFin) && slotEnd.isAfter(b.horaInicio)) {
                        blockOverlap = true;
                        break;
                    }
                }

                if (!apptOverlap && !blockOverlap) {
                    slots.add(new AppointmentSlotDTO(
                            slotStart.toString(),
                            slotEnd.toString(),
                            true
                    ));
                }

                tempTime = slotEnd;
            }
        }

        // Sort slots by startTime
        slots.sort((s1, s2) -> s1.getStartTime().compareTo(s2.getStartTime()));

        return new AppointmentAvailabilityResponse(
                doctorId.toString(),
                date.toString(),
                serviceId != null ? serviceId.toString() : null,
                locationId != null ? locationId.toString() : null,
                slots
        );
    }

    @Transactional
    public CreateAppointmentResponse createAppointment(CreateAppointmentRequest request) {
        // 1. Parse and validate UUIDs
        UUID patientId, doctorId, serviceId, locationId;
        try {
            patientId = UUID.fromString(request.getPatientId());
            doctorId = UUID.fromString(request.getDoctorId());
            serviceId = UUID.fromString(request.getServiceId());
            locationId = UUID.fromString(request.getLocationId());
        } catch (IllegalArgumentException e) {
            throw new AppointmentException("Datos inválidos para reservar la cita.", HttpStatus.BAD_REQUEST, "VALIDATION_ERROR");
        }

        // 2. Parse Date and Time
        LocalDate date;
        try {
            date = LocalDate.parse(request.getDate());
        } catch (Exception e) {
            throw new AppointmentException("La fecha es obligatoria y debe tener el formato YYYY-MM-DD.", HttpStatus.BAD_REQUEST, "VALIDATION_ERROR");
        }

        LocalTime startTime;
        try {
            startTime = LocalTime.parse(request.getStartTime());
        } catch (Exception e) {
            throw new AppointmentException("La hora de inicio es obligatoria y debe tener el formato HH:MM.", HttpStatus.BAD_REQUEST, "VALIDATION_ERROR");
        }

        // 3. Validate future date/time
        LocalDate today = LocalDate.now();
        if (date.isBefore(today)) {
            throw new AppointmentException("No se puede reservar una cita en una fecha u hora pasada.", HttpStatus.BAD_REQUEST, "PAST_APPOINTMENT");
        }
        if (date.equals(today) && !startTime.isAfter(LocalTime.now())) {
            throw new AppointmentException("No se puede reservar una cita en una fecha u hora pasada.", HttpStatus.BAD_REQUEST, "PAST_APPOINTMENT");
        }

        // 4. Validate patient exists
        if (!appointmentRepository.patientExists(patientId)) {
            throw new AppointmentNotFoundException("El paciente indicado no existe.", HttpStatus.NOT_FOUND, "PATIENT_NOT_FOUND");
        }

        // 5. Validate doctor exists
        if (!appointmentRepository.doctorExists(doctorId)) {
            throw new AppointmentNotFoundException("El doctor indicado no existe.", HttpStatus.NOT_FOUND, "DOCTOR_NOT_FOUND");
        }

        // 6. Validate service exists and is active
        AppointmentRepository.ServiceEntity service = appointmentRepository.getActiveService(serviceId);
        if (service == null) {
            throw new AppointmentException("El servicio indicado no existe o no está activo.", HttpStatus.BAD_REQUEST, "INVALID_SERVICE");
        }

        // 7. Validate location exists and is active
        AppointmentRepository.LocationEntity location = appointmentRepository.getActiveLocation(locationId);
        if (location == null) {
            throw new AppointmentException("El lugar de atención indicado no existe o no está activo.", HttpStatus.BAD_REQUEST, "INVALID_LOCATION");
        }

        // 8. Validate compatibility doctor-service-location-clinic
        if (service.doctorId != null && !service.doctorId.equals(doctorId)) {
            throw new AppointmentException("El servicio indicado no pertenece al doctor.", HttpStatus.BAD_REQUEST, "INVALID_SERVICE");
        }
        if (service.lugarAtencionId != null && !service.lugarAtencionId.equals(locationId)) {
            throw new AppointmentException("El servicio indicado no se ofrece en el lugar de atención seleccionado.", HttpStatus.BAD_REQUEST, "INVALID_SERVICE");
        }
        if (service.clinicaId != null) {
            if (!appointmentRepository.isDoctorActiveAtClinic(doctorId, service.clinicaId)) {
                throw new AppointmentException("El doctor no está activo en la clínica asociada al servicio.", HttpStatus.BAD_REQUEST, "INVALID_SERVICE");
            }
            if (location.clinicaId == null || !location.clinicaId.equals(service.clinicaId)) {
                throw new AppointmentException("El lugar de atención seleccionado no pertenece a la clínica del servicio.", HttpStatus.BAD_REQUEST, "INVALID_SERVICE");
            }
        }

        // 9. Validate location belongs to doctor or doctor belongs to location's clinic
        if (location.doctorId != null && !location.doctorId.equals(doctorId)) {
            throw new AppointmentException("El lugar de atención seleccionado no pertenece al doctor.", HttpStatus.BAD_REQUEST, "INVALID_LOCATION");
        }
        if (location.clinicaId != null) {
            if (!appointmentRepository.isDoctorActiveAtClinic(doctorId, location.clinicaId)) {
                throw new AppointmentException("El doctor no está activo en la clínica asociada al lugar de atención.", HttpStatus.BAD_REQUEST, "INVALID_LOCATION");
            }
        }

        // 10. Calculate endTime
        LocalTime endTime = startTime.plusMinutes(service.duracionMinutos);

        // 11. Validate working hours
        int dayOfWeek = date.getDayOfWeek().getValue();
        List<AppointmentRepository.ScheduleEntity> schedules = appointmentRepository.getActiveSchedules(doctorId, locationId, dayOfWeek);
        
        boolean insideWorkingHours = false;
        for (AppointmentRepository.ScheduleEntity s : schedules) {
            if ((startTime.equals(s.horaInicio) || startTime.isAfter(s.horaInicio))
                    && (endTime.equals(s.horaFin) || endTime.isBefore(s.horaFin))) {
                insideWorkingHours = true;
                break;
            }
        }
        if (!insideWorkingHours) {
            throw new OutsideWorkingHoursException("El horario seleccionado está fuera del horario de atención del doctor.");
        }

        // 12. Validate no overlapping appointments
        List<AppointmentRepository.TimeRange> appts = appointmentRepository.getExistingAppointments(doctorId, date);
        for (AppointmentRepository.TimeRange a : appts) {
            if (startTime.isBefore(a.endTime) && endTime.isAfter(a.startTime)) {
                throw new SlotAlreadyTakenException("El horario seleccionado ya no está disponible.");
            }
        }

        // 13. Validate no overlapping blocks
        List<AppointmentRepository.BlockEntity> blocks = appointmentRepository.getDisponibilidadBloqueos(doctorId, date, locationId);
        for (AppointmentRepository.BlockEntity b : blocks) {
            if (startTime.isBefore(b.horaFin) && endTime.isAfter(b.horaInicio)) {
                throw new SlotBlockedException("El horario seleccionado está bloqueado por el doctor.");
            }
        }

        // 14. Determine clinicId
        UUID clinicId = service.clinicaId != null ? service.clinicaId : location.clinicaId;

        // 15. Create UUID and set status as lowercase 'pendiente' for Postgres enum
        UUID appointmentId = UUID.randomUUID();
        String dbStatus = "pendiente";

        LocalDateTime now = LocalDateTime.now();

        // 16. Insert appointment
        appointmentRepository.insertCita(
                appointmentId,
                doctorId,
                patientId,
                date,
                startTime,
                endTime,
                serviceId,
                locationId,
                clinicId,
                service.precio,
                request.getReason(),
                request.getNotes(),
                dbStatus,
                now
        );

        return new CreateAppointmentResponse(
                appointmentId.toString(),
                patientId.toString(),
                doctorId.toString(),
                serviceId.toString(),
                service.nombre,
                locationId.toString(),
                location.nombre,
                clinicId != null ? clinicId.toString() : null,
                date.toString(),
                startTime.toString(),
                endTime.toString(),
                "Pendiente", // Response status should be capitalized "Pendiente"
                service.precio,
                request.getReason(),
                "Cita reservada correctamente"
        );
    }
}
