package com.example.medifind_springv.modules.profile.controller;

import com.example.medifind_springv.modules.profile.dto.DoctorLocationDTO;
import com.example.medifind_springv.modules.profile.service.DoctorLocationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor")
@CrossOrigin
public class DoctorLocationController {

    private final DoctorLocationService doctorLocationService;

    public DoctorLocationController(DoctorLocationService doctorLocationService) {
        this.doctorLocationService = doctorLocationService;
    }

    @GetMapping("/locations")
    public ResponseEntity<List<DoctorLocationDTO>> getLocations(@RequestParam String doctorId) {
        List<DoctorLocationDTO> locations = doctorLocationService.getDoctorLocations(doctorId);
        return ResponseEntity.ok(locations);
    }
}
