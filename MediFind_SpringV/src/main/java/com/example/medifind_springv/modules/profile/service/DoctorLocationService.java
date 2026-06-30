package com.example.medifind_springv.modules.profile.service;

import com.example.medifind_springv.modules.profile.dto.DoctorLocationDTO;
import com.example.medifind_springv.modules.profile.exception.DoctorNotFoundException;
import com.example.medifind_springv.modules.profile.exception.InvalidDoctorIdException;
import com.example.medifind_springv.modules.profile.repository.DoctorLocationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DoctorLocationService {

    private final DoctorLocationRepository doctorLocationRepository;

    public DoctorLocationService(DoctorLocationRepository doctorLocationRepository) {
        this.doctorLocationRepository = doctorLocationRepository;
    }

    public List<DoctorLocationDTO> getDoctorLocations(String doctorIdStr) {
        // 1. Validate UUID format
        UUID doctorId;
        try {
            doctorId = UUID.fromString(doctorIdStr);
        } catch (IllegalArgumentException e) {
            throw new InvalidDoctorIdException("El doctorId no tiene un formato UUID válido.");
        }

        // 2. Validate doctor exists
        if (!doctorLocationRepository.doctorExists(doctorId)) {
            throw new DoctorNotFoundException("El doctor indicado no existe.");
        }

        // 3. Return active locations
        return doctorLocationRepository.getDoctorLocations(doctorId);
    }
}
