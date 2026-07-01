package com.example.medifind_springv.modules.catalog.controller;

import com.example.medifind_springv.modules.catalog.dto.SpecialtyCatalogItemDTO;
import com.example.medifind_springv.modules.catalog.service.SpecialtyCatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/catalog/specialties")
@CrossOrigin
public class SpecialtyCatalogController {

    private final SpecialtyCatalogService service;

    public SpecialtyCatalogController(SpecialtyCatalogService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<SpecialtyCatalogItemDTO>> getSpecialties() {
        return ResponseEntity.ok(service.getSpecialties());
    }
}
