package com.example.medifind_springv.modules.profile.service;

import com.example.medifind_springv.modules.profile.dto.ProfessionalProfileDTO;
import com.example.medifind_springv.modules.profile.repository.ProfessionalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProfessionalService {

    private final ProfessionalRepository professionalRepository;

    public ProfessionalService(ProfessionalRepository professionalRepository) {
        this.professionalRepository = professionalRepository;
    }

    public List<ProfessionalProfileDTO> getAllProfessionals() {
        return professionalRepository.findAll();
    }

    public Optional<ProfessionalProfileDTO> getProfessionalById(UUID doctorId) {
        return professionalRepository.findById(doctorId);
    }

    public List<ProfessionalProfileDTO> searchProfessionals(String query) {
        return professionalRepository.search(query);
    }
}
