package com.example.medifind_springv.modules.patient.service;

import com.example.medifind_springv.modules.appointments.exception.AppointmentException;
import com.example.medifind_springv.modules.patient.dto.RecentDoctorResponse;
import com.example.medifind_springv.modules.patient.dto.RecentDoctorsListResponse;
import com.example.medifind_springv.modules.patient.dto.RecordRecentDoctorRequest;
import com.example.medifind_springv.modules.patient.repository.PatientRepository;
import com.example.medifind_springv.modules.patient.repository.RecentDoctorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class RecentDoctorService {

    private final RecentDoctorRepository recentDoctorRepository;
    private final PatientRepository patientRepository;

    public RecentDoctorService(RecentDoctorRepository recentDoctorRepository, PatientRepository patientRepository) {
        this.recentDoctorRepository = recentDoctorRepository;
        this.patientRepository = patientRepository;
    }

    @Transactional
    public RecentDoctorResponse recordView(RecordRecentDoctorRequest request) {
        UUID patientId = parseUuid(request.getPatientId(), "INVALID_PATIENT_ID", "El patientId no tiene formato válido.");
        UUID doctorId = parseUuid(request.getDoctorId(), "INVALID_DOCTOR_ID", "El doctorId no tiene formato válido.");

        if (!patientRepository.patientExists(patientId)) {
            throw new AppointmentException("El paciente indicado no existe.", HttpStatus.NOT_FOUND, "PATIENT_NOT_FOUND");
        }

        if (!recentDoctorRepository.doctorExists(doctorId)) {
            throw new AppointmentException("El doctor indicado no existe.", HttpStatus.NOT_FOUND, "DOCTOR_NOT_FOUND");
        }

        // Perform upsert
        UUID id = UUID.randomUUID();
        recentDoctorRepository.upsertRecentDoctor(id, patientId, doctorId);

        // Fetch recent doctors to find the recorded one and return it
        List<RecentDoctorResponse> list = recentDoctorRepository.findRecentDoctors(patientId, 1);
        RecentDoctorResponse response = list.isEmpty() ? null : list.get(0);

        if (response == null) {
            response = new RecentDoctorResponse(
                    request.getDoctorId(),
                    "",
                    "",
                    "",
                    "",
                    "",
                    "",
                    0.0,
                    0,
                    0.0,
                    LocalDateTime.now().toString()
            );
        }

        return response;
    }

    public RecentDoctorsListResponse getRecentDoctors(String patientIdStr, int limit) {
        UUID patientId = parseUuid(patientIdStr, "INVALID_PATIENT_ID", "El patientId no tiene formato válido.");
        if (!patientRepository.patientExists(patientId)) {
            throw new AppointmentException("El paciente indicado no existe.", HttpStatus.NOT_FOUND, "PATIENT_NOT_FOUND");
        }

        if (limit <= 0 || limit > 20) {
            limit = 10;
        }

        List<RecentDoctorResponse> items = recentDoctorRepository.findRecentDoctors(patientId, limit);
        return new RecentDoctorsListResponse(items);
    }

    private UUID parseUuid(String uuidStr, String errorCode, String errorMessage) {
        try {
            return UUID.fromString(uuidStr);
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new AppointmentException(errorMessage, HttpStatus.BAD_REQUEST, errorCode);
        }
    }
}
