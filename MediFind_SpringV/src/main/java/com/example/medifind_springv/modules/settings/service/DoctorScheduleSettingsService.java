package com.example.medifind_springv.modules.settings.service;

import com.example.medifind_springv.modules.appointments.exception.AppointmentException;
import com.example.medifind_springv.modules.settings.dto.*;
import com.example.medifind_springv.modules.settings.repository.DoctorScheduleSettingsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.format.DateTimeParseException;
import java.util.*;

@Service
public class DoctorScheduleSettingsService {

    private final DoctorScheduleSettingsRepository repository;

    public DoctorScheduleSettingsService(DoctorScheduleSettingsRepository repository) {
        this.repository = repository;
    }

    public DoctorScheduleResponse getDoctorSchedule(String doctorIdStr) {
        // 1. Validate doctorId format
        UUID doctorId;
        try {
            doctorId = UUID.fromString(doctorIdStr);
        } catch (IllegalArgumentException e) {
            throw new AppointmentException("El doctorId no tiene un formato UUID válido.", HttpStatus.BAD_REQUEST, "INVALID_DOCTOR_ID");
        }

        // 2. Validate doctor exists
        if (!repository.doctorExists(doctorId)) {
            throw new AppointmentException("El doctor indicado no existe.", HttpStatus.NOT_FOUND, "DOCTOR_NOT_FOUND");
        }

        // 3. Fetch active blocks
        List<DoctorScheduleBlockDTO> blocks = repository.getDoctorActiveSchedule(doctorId);

        // 4. Group by day of week (1 to 7)
        Map<Integer, List<DoctorScheduleBlockDTO>> grouped = new TreeMap<>();
        for (DoctorScheduleBlockDTO b : blocks) {
            grouped.computeIfAbsent(b.getDayOfWeek(), k -> new ArrayList<>()).add(b);
        }

        List<DoctorDayScheduleDTO> scheduleList = new ArrayList<>();
        for (Map.Entry<Integer, List<DoctorScheduleBlockDTO>> entry : grouped.entrySet()) {
            scheduleList.add(new DoctorDayScheduleDTO(
                    entry.getKey(),
                    getDayName(entry.getKey()),
                    entry.getValue()
            ));
        }

        return new DoctorScheduleResponse(doctorIdStr, scheduleList);
    }

    @Transactional
    public DoctorScheduleResponse replaceDoctorSchedule(ReplaceDoctorScheduleRequest request) {
        // 1. Validate doctorId format
        UUID doctorId;
        try {
            doctorId = UUID.fromString(request.getDoctorId());
        } catch (IllegalArgumentException e) {
            throw new AppointmentException("El doctorId no tiene un formato UUID válido.", HttpStatus.BAD_REQUEST, "INVALID_DOCTOR_ID");
        }

        // 2. Validate doctor exists
        if (!repository.doctorExists(doctorId)) {
            throw new AppointmentException("El doctor indicado no existe.", HttpStatus.NOT_FOUND, "DOCTOR_NOT_FOUND");
        }

        List<ReplaceDoctorDayScheduleDTO> scheduleRequest = request.getSchedule();

        // 3. If schedule is empty, deactivate all and return empty schedule
        if (scheduleRequest == null || scheduleRequest.isEmpty()) {
            repository.deactivateAllSchedules(doctorId);
            return new DoctorScheduleResponse(request.getDoctorId(), new ArrayList<>());
        }

        // 4. Parse and Validate every block
        List<ValidatedBlock> validatedBlocks = new ArrayList<>();

        for (ReplaceDoctorDayScheduleDTO dayDto : scheduleRequest) {
            Integer dayOfWeek = dayDto.getDayOfWeek();
            if (dayOfWeek == null || dayOfWeek < 1 || dayOfWeek > 7) {
                throw new AppointmentException("El día de la semana debe estar entre 1 y 7.", HttpStatus.BAD_REQUEST, "INVALID_DAY_OF_WEEK");
            }

            List<ReplaceDoctorScheduleBlockDTO> blocksDto = dayDto.getBlocks();
            if (blocksDto == null || blocksDto.isEmpty()) {
                continue; // No blocks for this day, skip
            }

            List<ValidatedBlock> dayBlocks = new ArrayList<>();

            for (ReplaceDoctorScheduleBlockDTO blockDto : blocksDto) {
                UUID locationId;
                try {
                    locationId = UUID.fromString(blockDto.getLocationId());
                } catch (IllegalArgumentException e) {
                    throw new AppointmentException("El lugar de atención no existe, no está activo o no pertenece al doctor.", HttpStatus.BAD_REQUEST, "INVALID_LOCATION");
                }

                // Validate location belongs to doctor
                if (!repository.isLocationValidForDoctor(doctorId, locationId)) {
                    throw new AppointmentException("El lugar de atención no existe, no está activo o no pertenece al doctor.", HttpStatus.BAD_REQUEST, "INVALID_LOCATION");
                }

                LocalTime startTime, endTime;
                try {
                    startTime = LocalTime.parse(blockDto.getStartTime().trim());
                    endTime = LocalTime.parse(blockDto.getEndTime().trim());
                } catch (DateTimeParseException | NullPointerException e) {
                    throw new AppointmentException("La hora de inicio debe ser menor que la hora de fin.", HttpStatus.BAD_REQUEST, "INVALID_TIME_RANGE");
                }

                if (!startTime.isBefore(endTime)) {
                    throw new AppointmentException("La hora de inicio debe ser menor que la hora de fin.", HttpStatus.BAD_REQUEST, "INVALID_TIME_RANGE");
                }

                Integer duration = blockDto.getAppointmentDurationMinutes();
                if (duration == null || duration <= 0) {
                    throw new AppointmentException("La duración de la cita no cabe dentro del bloque de horario.", HttpStatus.BAD_REQUEST, "INVALID_APPOINTMENT_DURATION");
                }

                if (startTime.plusMinutes(duration).isAfter(endTime)) {
                    throw new AppointmentException("La duración de la cita no cabe dentro del bloque de horario.", HttpStatus.BAD_REQUEST, "INVALID_APPOINTMENT_DURATION");
                }

                // Check overlap with other blocks of the SAME day
                for (ValidatedBlock existing : dayBlocks) {
                    if (startTime.isBefore(existing.endTime) && endTime.isAfter(existing.startTime)) {
                        throw new AppointmentException("Existen bloques de horario traslapados para el mismo día.", HttpStatus.BAD_REQUEST, "OVERLAPPING_SCHEDULE_BLOCKS");
                    }
                }

                ValidatedBlock vb = new ValidatedBlock(locationId, dayOfWeek, startTime, endTime, duration);
                dayBlocks.add(vb);
                validatedBlocks.add(vb);
            }
        }

        // 5. Execute replacement transactionally
        repository.deactivateAllSchedules(doctorId);

        for (ValidatedBlock vb : validatedBlocks) {
            repository.insertScheduleBlock(
                    UUID.randomUUID(),
                    doctorId,
                    vb.locationId,
                    vb.dayOfWeek,
                    vb.startTime,
                    vb.endTime,
                    vb.duration
            );
        }

        // 6. Return refreshed schedule
        return getDoctorSchedule(request.getDoctorId());
    }

    private String getDayName(int dayOfWeek) {
        switch (dayOfWeek) {
            case 1: return "Lunes";
            case 2: return "Martes";
            case 3: return "Miércoles";
            case 4: return "Jueves";
            case 5: return "Viernes";
            case 6: return "Sábado";
            case 7: return "Domingo";
            default: return "";
        }
    }

    private static class ValidatedBlock {
        UUID locationId;
        int dayOfWeek;
        LocalTime startTime;
        LocalTime endTime;
        int duration;

        ValidatedBlock(UUID locationId, int dayOfWeek, LocalTime startTime, LocalTime endTime, int duration) {
            this.locationId = locationId;
            this.dayOfWeek = dayOfWeek;
            this.startTime = startTime;
            this.endTime = endTime;
            this.duration = duration;
        }
    }
}
