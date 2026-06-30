package com.example.medifind_springv.modules.settings.service;

import com.example.medifind_springv.modules.appointments.exception.AppointmentException;
import com.example.medifind_springv.modules.settings.dto.*;
import com.example.medifind_springv.modules.settings.repository.DoctorLocationSettingsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class DoctorLocationSettingsService {

    private final DoctorLocationSettingsRepository repository;

    public DoctorLocationSettingsService(DoctorLocationSettingsRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public DoctorLocationResponse createLocation(CreateDoctorLocationRequest request) {
        UUID doctorId = parseDoctorId(request.getDoctorId());
        validateDoctorExists(doctorId);

        // Validation checks
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new AppointmentException("El nombre del lugar es obligatorio.", HttpStatus.BAD_REQUEST, "INVALID_LOCATION_NAME");
        }

        String dbType = mapTypeToDb(request.getType());
        if (dbType == null) {
            throw new AppointmentException("El tipo de lugar de atención no es válido.", HttpStatus.BAD_REQUEST, "INVALID_LOCATION_TYPE");
        }

        if (!"online".equals(dbType) && !"domicilio".equals(dbType)) {
            if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
                throw new AppointmentException("La dirección escrita es obligatoria para lugares presenciales.", HttpStatus.BAD_REQUEST, "INVALID_ADDRESS");
            }
        }

        validateCoordinates(request.getLatitude(), request.getLongitude());

        boolean isMain = request.getIsMain() != null ? request.getIsMain() : false;
        boolean hasAny = repository.hasAnyActiveLocation(doctorId);
        if (!hasAny) {
            isMain = true; // First active location is always main
        }

        if (isMain) {
            repository.clearAllPrincipals(doctorId);
        }

        UUID locationId = UUID.randomUUID();
        repository.insertLocation(
                locationId,
                doctorId,
                request.getName().trim(),
                request.getAddress() != null ? request.getAddress().trim() : "",
                request.getCity() != null ? request.getCity().trim() : "",
                request.getLatitude(),
                request.getLongitude(),
                dbType,
                isMain
        );

        return repository.getLocationById(locationId);
    }

    @Transactional
    public DoctorLocationResponse updateLocation(String locationIdStr, UpdateDoctorLocationRequest request) {
        UUID doctorId = parseDoctorId(request.getDoctorId());
        UUID locationId = parseLocationId(locationIdStr);
        validateDoctorExists(doctorId);

        DoctorLocationResponse existing = repository.getLocationById(locationId);
        if (existing == null) {
            throw new AppointmentException("El lugar de atención indicado no existe o no pertenece al doctor.", HttpStatus.NOT_FOUND, "LOCATION_NOT_FOUND");
        }

        // Validate Ownership
        if (existing.getDoctorId() == null && existing.getClinicId() != null) {
            throw new AppointmentException("Este lugar pertenece a una clínica y no puede editarse desde la configuración personal del doctor.", HttpStatus.FORBIDDEN, "CLINIC_LOCATION_READ_ONLY");
        }

        if (existing.getDoctorId() != null && !existing.getDoctorId().equals(request.getDoctorId())) {
            throw new AppointmentException("El lugar de atención indicado no existe o no pertenece al doctor.", HttpStatus.NOT_FOUND, "LOCATION_NOT_FOUND");
        }

        // Validation checks
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new AppointmentException("El nombre del lugar es obligatorio.", HttpStatus.BAD_REQUEST, "INVALID_LOCATION_NAME");
        }

        String dbType = mapTypeToDb(request.getType());
        if (dbType == null) {
            throw new AppointmentException("El tipo de lugar de atención no es válido.", HttpStatus.BAD_REQUEST, "INVALID_LOCATION_TYPE");
        }

        if (!"online".equals(dbType) && !"domicilio".equals(dbType)) {
            if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
                throw new AppointmentException("La dirección escrita es obligatoria para lugares presenciales.", HttpStatus.BAD_REQUEST, "INVALID_ADDRESS");
            }
        }

        validateCoordinates(request.getLatitude(), request.getLongitude());

        boolean isMain = request.getIsMain() != null ? request.getIsMain() : false;
        boolean active = request.getActive() != null ? request.getActive() : true;

        if (isMain && active) {
            repository.clearAllPrincipals(doctorId);
        }

        int rows = repository.updateLocation(
                locationId,
                doctorId,
                request.getName().trim(),
                request.getAddress() != null ? request.getAddress().trim() : "",
                request.getCity() != null ? request.getCity().trim() : "",
                request.getLatitude(),
                request.getLongitude(),
                dbType,
                isMain,
                active
        );

        if (rows == 0) {
            throw new AppointmentException("El lugar de atención indicado no existe o no pertenece al doctor.", HttpStatus.NOT_FOUND, "LOCATION_NOT_FOUND");
        }

        return repository.getLocationById(locationId);
    }

    @Transactional
    public DeleteDoctorLocationResponse softDeleteLocation(String locationIdStr, String doctorIdStr) {
        UUID doctorId = parseDoctorId(doctorIdStr);
        UUID locationId = parseLocationId(locationIdStr);
        validateDoctorExists(doctorId);

        DoctorLocationResponse existing = repository.getLocationById(locationId);
        if (existing == null) {
            throw new AppointmentException("El lugar de atención indicado no existe o no pertenece al doctor.", HttpStatus.NOT_FOUND, "LOCATION_NOT_FOUND");
        }

        if (existing.getDoctorId() == null && existing.getClinicId() != null) {
            throw new AppointmentException("Este lugar pertenece a una clínica y no puede editarse desde la configuración personal del doctor.", HttpStatus.FORBIDDEN, "CLINIC_LOCATION_READ_ONLY");
        }

        if (existing.getDoctorId() != null && !existing.getDoctorId().equals(doctorIdStr)) {
            throw new AppointmentException("El lugar de atención indicado no existe o no pertenece al doctor.", HttpStatus.NOT_FOUND, "LOCATION_NOT_FOUND");
        }

        int rows = repository.softDeleteLocation(locationId, doctorId);
        if (rows == 0) {
            throw new AppointmentException("El lugar de atención indicado no existe o no pertenece al doctor.", HttpStatus.NOT_FOUND, "LOCATION_NOT_FOUND");
        }

        return new DeleteDoctorLocationResponse(locationIdStr, doctorIdStr, false, "Lugar de atención desactivado correctamente");
    }

    @Transactional
    public DoctorLocationResponse setMainLocation(String locationIdStr, String doctorIdStr) {
        UUID doctorId = parseDoctorId(doctorIdStr);
        UUID locationId = parseLocationId(locationIdStr);
        validateDoctorExists(doctorId);

        DoctorLocationResponse existing = repository.getLocationById(locationId);
        if (existing == null || !existing.getActive()) {
            throw new AppointmentException("El lugar de atención indicado no existe o no pertenece al doctor.", HttpStatus.NOT_FOUND, "LOCATION_NOT_FOUND");
        }

        if (existing.getDoctorId() == null && existing.getClinicId() != null) {
            throw new AppointmentException("Este lugar pertenece a una clínica y no puede editarse desde la configuración personal del doctor.", HttpStatus.FORBIDDEN, "CLINIC_LOCATION_READ_ONLY");
        }

        if (existing.getDoctorId() != null && !existing.getDoctorId().equals(doctorIdStr)) {
            throw new AppointmentException("El lugar de atención indicado no existe o no pertenece al doctor.", HttpStatus.NOT_FOUND, "LOCATION_NOT_FOUND");
        }

        repository.clearAllPrincipals(doctorId);
        int rows = repository.setLocationAsPrincipal(locationId, doctorId);
        if (rows == 0) {
            throw new AppointmentException("El lugar de atención indicado no existe o no pertenece al doctor.", HttpStatus.NOT_FOUND, "LOCATION_NOT_FOUND");
        }

        DoctorLocationResponse updated = repository.getLocationById(locationId);
        return updated;
    }

    // Helper Methods

    private UUID parseDoctorId(String doctorIdStr) {
        try {
            return UUID.fromString(doctorIdStr);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new AppointmentException("El doctorId no tiene un formato UUID válido.", HttpStatus.BAD_REQUEST, "INVALID_DOCTOR_ID");
        }
    }

    private UUID parseLocationId(String locationIdStr) {
        try {
            return UUID.fromString(locationIdStr);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new AppointmentException("El locationId no tiene un formato UUID válido.", HttpStatus.BAD_REQUEST, "INVALID_LOCATION_ID");
        }
    }

    private void validateDoctorExists(UUID doctorId) {
        if (!repository.doctorExists(doctorId)) {
            throw new AppointmentException("El doctor indicado no existe.", HttpStatus.NOT_FOUND, "DOCTOR_NOT_FOUND");
        }
    }

    private void validateCoordinates(Double latitude, Double longitude) {
        if (latitude != null) {
            if (latitude < -90.0 || latitude > 90.0) {
                throw new AppointmentException("Las coordenadas enviadas no son válidas.", HttpStatus.BAD_REQUEST, "INVALID_COORDINATES");
            }
        }
        if (longitude != null) {
            if (longitude < -180.0 || longitude > 180.0) {
                throw new AppointmentException("Las coordenadas enviadas no son válidas.", HttpStatus.BAD_REQUEST, "INVALID_COORDINATES");
            }
        }
    }

    private String mapTypeToDb(String type) {
        if (type == null) return null;
        String upper = type.trim().toUpperCase();
        switch (upper) {
            case "CLINICA":
                return "clinica";
            case "CONSULTORIO_PRIVADO":
            case "PRESENCIAL":
                return "consultorio_privado";
            case "CASA":
                return "casa";
            case "DOMICILIO":
                return "domicilio";
            case "ONLINE":
                return "online";
            default:
                return null;
        }
    }
}
