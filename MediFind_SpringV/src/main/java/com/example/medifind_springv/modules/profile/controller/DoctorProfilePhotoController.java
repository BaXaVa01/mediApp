package com.example.medifind_springv.modules.profile.controller;

import com.example.medifind_springv.config.AuthenticatedUser;
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
    private final AuthenticatedUser authenticatedUser;

    public DoctorProfilePhotoController(DoctorProfilePhotoService photoService, AuthenticatedUser authenticatedUser) {
        this.photoService = photoService;
        this.authenticatedUser = authenticatedUser;
    }

    @PostMapping
    public ResponseEntity<DoctorProfilePhotoResponse> uploadPhoto(
            @RequestParam("doctorId") String doctorId,
            @RequestParam("file") MultipartFile file) {
        authenticatedUser.verifyDoctorOwnership(doctorId);
        return ResponseEntity.ok(photoService.uploadProfilePhoto(doctorId, file));
    }
}
