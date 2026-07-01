package com.example.medifind_springv.modules.catalog.service;

import com.example.medifind_springv.modules.catalog.dto.SpecialtyCatalogItemDTO;
import com.example.medifind_springv.modules.catalog.repository.SpecialtyCatalogRepository;
import com.example.medifind_springv.modules.appointments.exception.AppointmentException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SpecialtyCatalogService {

    private final SpecialtyCatalogRepository repository;

    public SpecialtyCatalogService(SpecialtyCatalogRepository repository) {
        this.repository = repository;
    }

    public List<SpecialtyCatalogItemDTO> getSpecialties() {
        try {
            return repository.findAllSpecialties();
        } catch (Exception e) {
            throw new AppointmentException(
                    "No se pudo cargar el catálogo de especialidades.",
                    HttpStatus.INTERNAL_SERVER_ERROR,
                    "SPECIALTY_CATALOG_ERROR"
            );
        }
    }
}
