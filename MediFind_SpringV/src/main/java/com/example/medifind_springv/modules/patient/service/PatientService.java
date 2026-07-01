package com.example.medifind_springv.modules.patient.service;

import com.example.medifind_springv.modules.appointments.exception.AppointmentException;
import com.example.medifind_springv.modules.patient.dto.*;
import com.example.medifind_springv.modules.patient.repository.PatientAppointmentsRepository;
import com.example.medifind_springv.modules.patient.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final PatientAppointmentsRepository appointmentsRepository;

    @Value("${app.uploads.root:uploads}")
    private String uploadRoot;

    public PatientService(PatientRepository patientRepository, PatientAppointmentsRepository appointmentsRepository) {
        this.patientRepository = patientRepository;
        this.appointmentsRepository = appointmentsRepository;
    }

    public PatientProfileResponse getPatientProfile(String patientIdStr) {
        UUID patientId = parseUuid(patientIdStr, "INVALID_PATIENT_ID", "El patientId no tiene formato válido.");
        if (!patientRepository.patientExists(patientId)) {
            throw new AppointmentException("El paciente indicado no existe.", HttpStatus.NOT_FOUND, "PATIENT_NOT_FOUND");
        }
        return patientRepository.findProfileById(patientId);
    }

    @Transactional
    public PatientProfileResponse updatePatientProfile(UpdatePatientProfileRequest request) {
        UUID patientId = parseUuid(request.getPatientId(), "INVALID_PATIENT_ID", "El patientId no tiene formato válido.");
        if (!patientRepository.patientExists(patientId)) {
            throw new AppointmentException("El paciente indicado no existe.", HttpStatus.NOT_FOUND, "PATIENT_NOT_FOUND");
        }

        UUID userId = patientRepository.findUserIdByPatientId(patientId);
        if (userId == null) {
            throw new AppointmentException("El paciente indicado no existe.", HttpStatus.NOT_FOUND, "PATIENT_NOT_FOUND");
        }

        // Update user (usuario) fields
        patientRepository.updateUsuario(userId, request.getName().trim(), request.getPhone(), LocalDateTime.now());

        // Parse birthDate if provided
        LocalDate birthDate = null;
        if (request.getBirthDate() != null && !request.getBirthDate().trim().isEmpty()) {
            birthDate = LocalDate.parse(request.getBirthDate().trim());
        }

        // Map and validate gender
        String dbGender = mapGenderToDb(request.getGender());

        // Update patient (paciente) fields
        patientRepository.updatePaciente(patientId, birthDate, dbGender, request.getAddress());

        return patientRepository.findProfileById(patientId);
    }

    @Transactional
    public PatientProfilePhotoResponse uploadProfilePhoto(String patientIdStr, MultipartFile file) {
        UUID patientId = parseUuid(patientIdStr, "INVALID_PATIENT_ID", "El patientId no tiene formato válido.");
        if (!patientRepository.patientExists(patientId)) {
            throw new AppointmentException("El paciente indicado no existe.", HttpStatus.NOT_FOUND, "PATIENT_NOT_FOUND");
        }

        if (file == null || file.isEmpty()) {
            throw new AppointmentException("El archivo enviado está vacío.", HttpStatus.BAD_REQUEST, "EMPTY_FILE");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new AppointmentException("La imagen no debe superar el tamaño máximo permitido.", HttpStatus.BAD_REQUEST, "FILE_TOO_LARGE");
        }

        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equalsIgnoreCase("image/jpeg") &&
                !contentType.equalsIgnoreCase("image/png") &&
                !contentType.equalsIgnoreCase("image/webp"))) {
            throw new AppointmentException("Solo se permiten imágenes JPG, PNG o WEBP.", HttpStatus.BAD_REQUEST, "INVALID_FILE_TYPE");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase().trim();
        }
        if (!extension.equals("jpg") && !extension.equals("jpeg") && !extension.equals("png") && !extension.equals("webp")) {
            throw new AppointmentException("Solo se permiten imágenes JPG, PNG o WEBP.", HttpStatus.BAD_REQUEST, "INVALID_FILE_TYPE");
        }

        Path uploadsRootPath = Paths.get(uploadRoot).toAbsolutePath().normalize();
        Path targetDir = Paths.get(uploadRoot, "patients", patientIdStr).toAbsolutePath().normalize();

        if (!targetDir.startsWith(uploadsRootPath)) {
            throw new AppointmentException("Acceso no autorizado al almacenamiento.", HttpStatus.FORBIDDEN, "ACCESS_DENIED");
        }

        long timestamp = System.currentTimeMillis();
        String safeFilename = "profile-" + timestamp + "." + extension;
        Path targetFile = targetDir.resolve(safeFilename).normalize();

        if (!targetFile.startsWith(targetDir)) {
            throw new AppointmentException("Acceso no autorizado al almacenamiento.", HttpStatus.FORBIDDEN, "ACCESS_DENIED");
        }

        try {
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }
            Files.write(targetFile, file.getBytes());
        } catch (IOException e) {
            throw new AppointmentException("No se pudo subir la foto de perfil.", HttpStatus.INTERNAL_SERVER_ERROR, "PHOTO_UPLOAD_ERROR");
        }

        String currentPhotoUrl = patientRepository.findCurrentPhotoUrl(patientId);
        String relativePhotoPath = "patients/" + patientIdStr + "/" + safeFilename;

        try {
            patientRepository.updatePatientPhotoUrl(patientId, relativePhotoPath);
        } catch (Exception e) {
            try {
                Files.deleteIfExists(targetFile);
            } catch (IOException ignored) {}
            throw new AppointmentException("No se pudo actualizar la imagen de perfil en la base de datos.", HttpStatus.INTERNAL_SERVER_ERROR, "PHOTO_UPLOAD_ERROR");
        }

        // Delete old physical photo if it exists
        if (currentPhotoUrl != null && !currentPhotoUrl.trim().isEmpty() && !currentPhotoUrl.startsWith("http")) {
            Path oldFilePath = Paths.get(uploadRoot, currentPhotoUrl).toAbsolutePath().normalize();
            if (oldFilePath.startsWith(uploadsRootPath)) {
                try {
                    Files.deleteIfExists(oldFilePath);
                } catch (IOException ignored) {}
            }
        }

        String responsePhotoUrl = "/api/patients/" + patientIdStr + "/photo";
        return new PatientProfilePhotoResponse(patientIdStr, responsePhotoUrl, "Foto de perfil actualizada correctamente");
    }

    public Resource getPatientPhotoResource(String patientIdStr) {
        UUID patientId = parseUuid(patientIdStr, "INVALID_PATIENT_ID", "El patientId no tiene formato válido.");
        if (!patientRepository.patientExists(patientId)) {
            throw new AppointmentException("El paciente indicado no existe.", HttpStatus.NOT_FOUND, "PATIENT_NOT_FOUND");
        }

        String dbFotoUrl = patientRepository.findCurrentPhotoUrl(patientId);
        if (dbFotoUrl == null || dbFotoUrl.trim().isEmpty()) {
            throw new AppointmentException("El paciente no tiene una foto de perfil registrada.", HttpStatus.NOT_FOUND, "PHOTO_NOT_FOUND");
        }

        String trimmed = dbFotoUrl.trim();
        if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
            return null;
        }

        Path uploadsRootPath = Paths.get(uploadRoot).toAbsolutePath().normalize();
        Path filePath = Paths.get(uploadRoot, trimmed).toAbsolutePath().normalize();

        if (!filePath.startsWith(uploadsRootPath)) {
            throw new AppointmentException("Acceso no autorizado al almacenamiento.", HttpStatus.FORBIDDEN, "ACCESS_DENIED");
        }

        if (!Files.exists(filePath) || !Files.isRegularFile(filePath)) {
            throw new AppointmentException("El archivo de la imagen no existe.", HttpStatus.NOT_FOUND, "FILE_NOT_FOUND");
        }

        return new FileSystemResource(filePath);
    }

    public PatientAppointmentsPageResponse getPatientAppointments(String patientIdStr, String status, int page, int size) {
        UUID patientId = parseUuid(patientIdStr, "INVALID_PATIENT_ID", "El patientId no tiene formato válido.");
        if (!patientRepository.patientExists(patientId)) {
            throw new AppointmentException("El paciente indicado no existe.", HttpStatus.NOT_FOUND, "PATIENT_NOT_FOUND");
        }

        if (page < 0 || size <= 0 || size > 50) {
            throw new AppointmentException("Los parámetros de paginación no son válidos.", HttpStatus.BAD_REQUEST, "INVALID_PAGE");
        }

        String dbStatus = null;
        if (status != null && !status.trim().isEmpty()) {
            dbStatus = mapStatusToDb(status);
        }

        long totalElements = appointmentsRepository.countAppointments(patientId, dbStatus);
        int totalPages = (int) Math.ceil((double) totalElements / size);
        int offset = page * size;

        List<PatientAppointmentDTO> items = appointmentsRepository.findAppointments(patientId, dbStatus, size, offset);

        return new PatientAppointmentsPageResponse(page, size, totalElements, totalPages, items);
    }

    @Transactional
    public CancelPatientAppointmentResponse cancelAppointment(String appointmentIdStr, CancelPatientAppointmentRequest request) {
        UUID appointmentId = parseUuid(appointmentIdStr, "INVALID_APPOINTMENT_ID", "El appointmentId no tiene formato válido.");
        UUID patientId = parseUuid(request.getPatientId(), "INVALID_PATIENT_ID", "El patientId no tiene formato válido.");

        if (!appointmentsRepository.appointmentExists(appointmentId)) {
            throw new AppointmentException("La cita indicada no existe.", HttpStatus.NOT_FOUND, "APPOINTMENT_NOT_FOUND");
        }

        UUID apptPatientId = appointmentsRepository.findPatientIdByAppointmentId(appointmentId);
        if (apptPatientId == null || !apptPatientId.equals(patientId)) {
            throw new AppointmentException("No podés modificar una cita de otro paciente.", HttpStatus.FORBIDDEN, "APPOINTMENT_NOT_OWNED_BY_PATIENT");
        }

        String currentStatus = appointmentsRepository.findAppointmentStatus(appointmentId);
        if (currentStatus == null) {
            throw new AppointmentException("La cita indicada no existe.", HttpStatus.NOT_FOUND, "APPOINTMENT_NOT_FOUND");
        }

        LocalDate date = appointmentsRepository.findAppointmentDate(appointmentId);
        LocalTime startTime = appointmentsRepository.findAppointmentStartTime(appointmentId);

        // Validation: cannot cancel completed, cancelled or rejected
        if ("completada".equalsIgnoreCase(currentStatus) || "cancelada".equalsIgnoreCase(currentStatus) || "rechazada".equalsIgnoreCase(currentStatus)) {
            throw new AppointmentException("Esta cita ya no puede cancelarse.", HttpStatus.BAD_REQUEST, "APPOINTMENT_NOT_CANCELABLE");
        }

        // Cannot cancel if it is in the past
        if (date != null && startTime != null) {
            LocalDate today = LocalDate.now();
            LocalTime now = LocalTime.now();
            if (date.isBefore(today) || (date.isEqual(today) && !startTime.isAfter(now))) {
                throw new AppointmentException("Esta cita ya no puede cancelarse.", HttpStatus.BAD_REQUEST, "APPOINTMENT_NOT_CANCELABLE");
            }
        }

        appointmentsRepository.updateAppointmentStatus(appointmentId, "cancelada", request.getReason(), LocalDateTime.now());

        return new CancelPatientAppointmentResponse(appointmentIdStr, "CANCELLED", "Cita cancelada correctamente");
    }

    private UUID parseUuid(String uuidStr, String errorCode, String errorMessage) {
        try {
            return UUID.fromString(uuidStr);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new AppointmentException(errorMessage, HttpStatus.BAD_REQUEST, errorCode);
        }
    }

    private String mapGenderToDb(String input) {
        if (input == null || input.trim().isEmpty()) {
            return null;
        }
        String val = input.trim().toUpperCase();
        switch (val) {
            case "MALE":
            case "MASCULINO":
                return "masculino";
            case "FEMALE":
            case "FEMENINO":
                return "femenino";
            case "OTHER":
            case "OTRO":
                return "otro";
            case "NOT_SPECIFIED":
            case "NO_ESPECIFICADO":
                return "no_especificado";
            default:
                throw new AppointmentException("El género indicado no es válido.", HttpStatus.BAD_REQUEST, "INVALID_GENDER");
        }
    }

    private String mapStatusToDb(String input) {
        String val = input.trim().toUpperCase();
        switch (val) {
            case "PENDING":
            case "PENDIENTE":
            case "NEW":
                return "pendiente";
            case "ACCEPTED":
            case "APPROVED":
            case "APROBADA":
            case "CONFIRMED":
            case "CONFIRMADA":
                return "confirmada";
            case "CANCELLED":
            case "CANCELED":
            case "CANCELADA":
                return "cancelada";
            case "COMPLETED":
            case "COMPLETADA":
                return "completada";
            case "BLOQUEADA":
            case "BLOCKED":
                return "bloqueada";
            default:
                throw new AppointmentException("El estado indicado no es válido.", HttpStatus.BAD_REQUEST, "INVALID_STATUS");
        }
    }
}
