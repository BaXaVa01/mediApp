package com.example.medifind_springv.modules.profile.controller;

import com.example.medifind_springv.modules.profile.dto.DoctorProfilePhotoResponse;
import com.example.medifind_springv.modules.profile.service.DoctorProfilePhotoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/doctor/profile/photo")
@CrossOrigin
public class DoctorProfilePhotoController {

    private final DoctorProfilePhotoService photoService;

    public DoctorProfilePhotoController(DoctorProfilePhotoService photoService) {
        this.photoService = photoService;
    }

    @PostMapping
    public ResponseEntity<DoctorProfilePhotoResponse> uploadPhoto(
            @RequestParam("doctorId") String doctorId,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(photoService.uploadProfilePhoto(doctorId, file));
    }
}
