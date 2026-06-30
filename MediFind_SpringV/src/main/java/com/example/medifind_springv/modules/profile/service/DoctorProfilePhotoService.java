package com.example.medifind_springv.modules.profile.service;

import com.example.medifind_springv.modules.appointments.exception.AppointmentException;
import com.example.medifind_springv.modules.profile.dto.DoctorProfilePhotoResponse;
import com.example.medifind_springv.modules.profile.repository.DoctorProfilePhotoRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class DoctorProfilePhotoService {

    private final DoctorProfilePhotoRepository repository;

    @Value("${app.uploads.root:uploads}")
    private String uploadRoot;

    @Value("${app.uploads.public-path:/uploads}")
    private String publicPath;

    public DoctorProfilePhotoService(DoctorProfilePhotoRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public DoctorProfilePhotoResponse uploadProfilePhoto(String doctorIdStr, MultipartFile file) {
        // 1. Validar doctorId
        UUID doctorId = parseDoctorId(doctorIdStr);

        // 2. Validar doctor exista
        if (!repository.doctorExists(doctorId)) {
            throw new AppointmentException("El doctor indicado no existe.", HttpStatus.NOT_FOUND, "DOCTOR_NOT_FOUND");
        }

        // 3. Validar archivo
        if (file == null) {
            throw new AppointmentException("Debe enviar una imagen de perfil.", HttpStatus.BAD_REQUEST, "FILE_REQUIRED");
        }
        if (file.isEmpty()) {
            throw new AppointmentException("El archivo enviado está vacío.", HttpStatus.BAD_REQUEST, "EMPTY_FILE");
        }

        // 4. Validar tamaño (máximo 5 MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new AppointmentException("La imagen no debe superar el tamaño máximo permitido.", HttpStatus.BAD_REQUEST, "FILE_TOO_LARGE");
        }

        // 5. Validar content-type
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equalsIgnoreCase("image/jpeg") &&
                !contentType.equalsIgnoreCase("image/png") &&
                !contentType.equalsIgnoreCase("image/webp"))) {
            throw new AppointmentException("Solo se permiten imágenes JPG, PNG o WEBP.", HttpStatus.BAD_REQUEST, "INVALID_FILE_TYPE");
        }

        // 6. Validar extensión
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase().trim();
        }
        if (!extension.equals("jpg") && !extension.equals("jpeg") && !extension.equals("png") && !extension.equals("webp")) {
            throw new AppointmentException("Solo se permiten imágenes JPG, PNG o WEBP.", HttpStatus.BAD_REQUEST, "INVALID_FILE_TYPE");
        }

        // 7. Configurar carpetas persistentes y evitar path traversal
        Path uploadsRootPath = Paths.get(uploadRoot).toAbsolutePath().normalize();
        Path targetDir = Paths.get(uploadRoot, "doctors", doctorIdStr).toAbsolutePath().normalize();

        if (!targetDir.startsWith(uploadsRootPath)) {
            throw new AppointmentException("Acceso no autorizado al almacenamiento.", HttpStatus.BAD_REQUEST, "FILE_STORAGE_ERROR");
        }

        long timestamp = System.currentTimeMillis();
        String safeFilename = "profile-" + timestamp + "." + extension;
        Path targetFile = targetDir.resolve(safeFilename).normalize();

        if (!targetFile.startsWith(targetDir)) {
            throw new AppointmentException("Acceso no autorizado al almacenamiento.", HttpStatus.BAD_REQUEST, "FILE_STORAGE_ERROR");
        }

        // Guardar archivo en disco
        try {
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }
            Files.write(targetFile, file.getBytes());
        } catch (IOException e) {
            throw new AppointmentException("No se pudo guardar la imagen de perfil.", HttpStatus.INTERNAL_SERVER_ERROR, "FILE_STORAGE_ERROR");
        }

        // 8. Actualizar base de datos
        String currentPhotoUrl = repository.findCurrentPhotoUrl(doctorId);
        String publicPhotoUrl = publicPath + "/doctors/" + doctorIdStr + "/" + safeFilename;

        try {
            repository.updateDoctorPhotoUrl(doctorId, publicPhotoUrl);
        } catch (Exception e) {
            // Rollback del archivo físico si la DB falla
            try {
                Files.deleteIfExists(targetFile);
            } catch (IOException ignored) {}
            throw new AppointmentException("No se pudo actualizar la imagen de perfil en la base de datos.", HttpStatus.INTERNAL_SERVER_ERROR, "FILE_STORAGE_ERROR");
        }

        // 9. Borrar foto local anterior si existía
        if (currentPhotoUrl != null && currentPhotoUrl.startsWith(publicPath)) {
            String relativePath = currentPhotoUrl.substring(publicPath.length());
            Path oldFilePath = Paths.get(uploadRoot, relativePath).toAbsolutePath().normalize();
            if (oldFilePath.startsWith(uploadsRootPath)) {
                try {
                    Files.deleteIfExists(oldFilePath);
                } catch (IOException ignored) {}
            }
        }

        return new DoctorProfilePhotoResponse(doctorIdStr, publicPhotoUrl, "Foto de perfil actualizada correctamente");
    }

    private UUID parseDoctorId(String doctorIdStr) {
        if (doctorIdStr == null || doctorIdStr.trim().isEmpty()) {
            throw new AppointmentException("El doctorId no tiene un formato UUID válido.", HttpStatus.BAD_REQUEST, "INVALID_DOCTOR_ID");
        }
        try {
            return UUID.fromString(doctorIdStr.trim());
        } catch (IllegalArgumentException e) {
            throw new AppointmentException("El doctorId no tiene un formato UUID válido.", HttpStatus.BAD_REQUEST, "INVALID_DOCTOR_ID");
        }
    }
}
