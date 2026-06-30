package com.example.medifind_springv.modules.settings.service;

import com.example.medifind_springv.modules.appointments.exception.AppointmentException;
import com.example.medifind_springv.modules.settings.dto.*;
import com.example.medifind_springv.modules.settings.repository.DoctorServiceSettingsRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class DoctorServiceSettingsService {

    private final DoctorServiceSettingsRepository repository;

    public DoctorServiceSettingsService(DoctorServiceSettingsRepository repository) {
        this.repository = repository;
    }

    public DoctorServicesListResponse listServices(String doctorIdStr, boolean includeInactive) {
        UUID doctorId = parseDoctorId(doctorIdStr);
        validateDoctorExists(doctorId);

        List<DoctorServiceResponse> services = repository.listServices(doctorId, includeInactive);
        return new DoctorServicesListResponse(doctorIdStr, services);
    }

    public DoctorServiceResponse getServiceDetail(String doctorIdStr, String serviceIdStr) {
        UUID doctorId = parseDoctorId(doctorIdStr);
        UUID serviceId = parseServiceId(serviceIdStr);
        validateDoctorExists(doctorId);

        DoctorServiceResponse service = repository.getServiceDetail(doctorId, serviceId);
        if (service == null) {
            throw new AppointmentException("El servicio indicado no existe o no pertenece al doctor.", HttpStatus.NOT_FOUND, "SERVICE_NOT_FOUND");
        }
        return service;
    }

    @Transactional
    public DoctorServiceResponse createService(CreateDoctorServiceRequest request) {
        UUID doctorId = parseDoctorId(request.getDoctorId());
        validateDoctorExists(doctorId);

        // Validation checks
        validateServiceFields(request.getName(), request.getDurationMinutes(), request.getPrice());

        UUID locationId = null;
        if (request.getLocationId() != null && !request.getLocationId().trim().isEmpty()) {
            try {
                locationId = UUID.fromString(request.getLocationId().trim());
            } catch (IllegalArgumentException e) {
                throw new AppointmentException("El lugar de atención no existe, no está activo o no pertenece al doctor.", HttpStatus.BAD_REQUEST, "INVALID_LOCATION");
            }
            if (!repository.isLocationValidForDoctor(doctorId, locationId)) {
                throw new AppointmentException("El lugar de atención no existe, no está activo o no pertenece al doctor.", HttpStatus.BAD_REQUEST, "INVALID_LOCATION");
            }
        }

        UUID clinicId = null;
        if (request.getClinicId() != null && !request.getClinicId().trim().isEmpty()) {
            try {
                clinicId = UUID.fromString(request.getClinicId().trim());
            } catch (IllegalArgumentException e) {
                throw new AppointmentException("La clínica indicada no existe o no está asociada activamente al doctor.", HttpStatus.BAD_REQUEST, "INVALID_CLINIC");
            }
            if (!repository.isClinicValidForDoctor(doctorId, clinicId)) {
                throw new AppointmentException("La clínica indicada no existe o no está asociada activamente al doctor.", HttpStatus.BAD_REQUEST, "INVALID_CLINIC");
            }
        }

        // Compatibility checks
        if (locationId != null) {
            UUID locClinicId = repository.getClinicIdForLocation(locationId);
            if (locClinicId != null) {
                if (clinicId != null && !clinicId.equals(locClinicId)) {
                    throw new AppointmentException("El lugar de atención no pertenece a la clínica indicada.", HttpStatus.BAD_REQUEST, "LOCATION_CLINIC_MISMATCH");
                }
                // Use location clinic as fallback
                if (clinicId == null) {
                    clinicId = locClinicId;
                }
            }
        }

        UUID serviceId = UUID.randomUUID();
        repository.insertService(
                serviceId,
                doctorId,
                clinicId,
                locationId,
                request.getName().trim(),
                request.getDescription() != null ? request.getDescription().trim() : "",
                request.getDurationMinutes(),
                request.getPrice()
        );

        return repository.getServiceDetail(doctorId, serviceId);
    }

    @Transactional
    public DoctorServiceResponse updateService(String serviceIdStr, UpdateDoctorServiceRequest request) {
        UUID doctorId = parseDoctorId(request.getDoctorId());
        UUID serviceId = parseServiceId(serviceIdStr);
        validateDoctorExists(doctorId);

        // Validation checks
        validateServiceFields(request.getName(), request.getDurationMinutes(), request.getPrice());

        UUID locationId = null;
        if (request.getLocationId() != null && !request.getLocationId().trim().isEmpty()) {
            try {
                locationId = UUID.fromString(request.getLocationId().trim());
            } catch (IllegalArgumentException e) {
                throw new AppointmentException("El lugar de atención no existe, no está activo o no pertenece al doctor.", HttpStatus.BAD_REQUEST, "INVALID_LOCATION");
            }
            if (!repository.isLocationValidForDoctor(doctorId, locationId)) {
                throw new AppointmentException("El lugar de atención no existe, no está activo o no pertenece al doctor.", HttpStatus.BAD_REQUEST, "INVALID_LOCATION");
            }
        }

        UUID clinicId = null;
        if (request.getClinicId() != null && !request.getClinicId().trim().isEmpty()) {
            try {
                clinicId = UUID.fromString(request.getClinicId().trim());
            } catch (IllegalArgumentException e) {
                throw new AppointmentException("La clínica indicada no existe o no está asociada activamente al doctor.", HttpStatus.BAD_REQUEST, "INVALID_CLINIC");
            }
            if (!repository.isClinicValidForDoctor(doctorId, clinicId)) {
                throw new AppointmentException("La clínica indicada no existe o no está asociada activamente al doctor.", HttpStatus.BAD_REQUEST, "INVALID_CLINIC");
            }
        }

        // Compatibility checks
        if (locationId != null) {
            UUID locClinicId = repository.getClinicIdForLocation(locationId);
            if (locClinicId != null) {
                if (clinicId != null && !clinicId.equals(locClinicId)) {
                    throw new AppointmentException("El lugar de atención no pertenece a la clínica indicada.", HttpStatus.BAD_REQUEST, "LOCATION_CLINIC_MISMATCH");
                }
                if (clinicId == null) {
                    clinicId = locClinicId;
                }
            }
        }

        boolean active = request.getActive() != null ? request.getActive() : true;

        int updated = repository.updateService(
                serviceId,
                doctorId,
                clinicId,
                locationId,
                request.getName().trim(),
                request.getDescription() != null ? request.getDescription().trim() : "",
                request.getDurationMinutes(),
                request.getPrice(),
                active
        );

        if (updated == 0) {
            throw new AppointmentException("El servicio indicado no existe o no pertenece al doctor.", HttpStatus.NOT_FOUND, "SERVICE_NOT_FOUND");
        }

        return repository.getServiceDetail(doctorId, serviceId);
    }

    @Transactional
    public DeleteDoctorServiceResponse softDeleteService(String serviceIdStr, String doctorIdStr) {
        UUID doctorId = parseDoctorId(doctorIdStr);
        UUID serviceId = parseServiceId(serviceIdStr);
        validateDoctorExists(doctorId);

        int updated = repository.softDeleteService(serviceId, doctorId);
        if (updated == 0) {
            throw new AppointmentException("El servicio indicado no existe o no pertenece al doctor.", HttpStatus.NOT_FOUND, "SERVICE_NOT_FOUND");
        }

        return new DeleteDoctorServiceResponse(
                serviceIdStr,
                doctorIdStr,
                false,
                "Servicio desactivado correctamente"
        );
    }

    private UUID parseDoctorId(String doctorIdStr) {
        try {
            return UUID.fromString(doctorIdStr);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new AppointmentException("El doctorId no tiene un formato UUID válido.", HttpStatus.BAD_REQUEST, "INVALID_DOCTOR_ID");
        }
    }

    private UUID parseServiceId(String serviceIdStr) {
        try {
            return UUID.fromString(serviceIdStr);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new AppointmentException("El serviceId no tiene un formato UUID válido.", HttpStatus.BAD_REQUEST, "INVALID_SERVICE_ID");
        }
    }

    private void validateDoctorExists(UUID doctorId) {
        if (!repository.doctorExists(doctorId)) {
            throw new AppointmentException("El doctor indicado no existe.", HttpStatus.NOT_FOUND, "DOCTOR_NOT_FOUND");
        }
    }

    private void validateServiceFields(String name, Integer durationMinutes, Double price) {
        if (name == null || name.trim().length() < 3 || name.trim().length() > 150) {
            throw new AppointmentException("El nombre del servicio es obligatorio y debe tener entre 3 y 150 caracteres.", HttpStatus.BAD_REQUEST, "INVALID_SERVICE_NAME");
        }
        if (durationMinutes == null || durationMinutes <= 0) {
            throw new AppointmentException("La duración del servicio debe ser mayor que 0.", HttpStatus.BAD_REQUEST, "INVALID_DURATION");
        }
        if (price == null || price < 0) {
            throw new AppointmentException("El precio del servicio no puede ser negativo.", HttpStatus.BAD_REQUEST, "INVALID_PRICE");
        }
    }
}
