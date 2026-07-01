package com.example.medifind_springv.config;

import com.example.medifind_springv.modules.appointments.exception.AppointmentException;
import com.example.medifind_springv.modules.auth.exception.ResourceNotOwnedException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class AuthenticatedUser {

    public AuthenticatedUserPrincipal getPrincipal() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new AppointmentException("Debe iniciar sesión para acceder a este recurso.", HttpStatus.UNAUTHORIZED, "UNAUTHORIZED");
        }
        Object principal = auth.getPrincipal();
        if (principal instanceof AuthenticatedUserPrincipal) {
            return (AuthenticatedUserPrincipal) principal;
        }
        throw new AppointmentException("Debe iniciar sesión para acceder a este recurso.", HttpStatus.UNAUTHORIZED, "UNAUTHORIZED");
    }

    public void verifyDoctorOwnership(String requestDoctorId) {
        AuthenticatedUserPrincipal principal = getPrincipal();
        if (!"doctor".equalsIgnoreCase(principal.getRole()) && !"ROLE_DOCTOR".equalsIgnoreCase(principal.getRole())) {
            throw new AppointmentException("No tiene permisos para acceder a este recurso.", HttpStatus.FORBIDDEN, "FORBIDDEN");
        }
        if (requestDoctorId == null || !requestDoctorId.equalsIgnoreCase(principal.getProfileId())) {
            throw new ResourceNotOwnedException("No puede acceder o modificar recursos de otro usuario.");
        }
    }

    public void verifyPatientOwnership(String requestPatientId) {
        AuthenticatedUserPrincipal principal = getPrincipal();
        if (requestPatientId == null || !requestPatientId.equalsIgnoreCase(principal.getProfileId())) {
            throw new ResourceNotOwnedException("No puede acceder o modificar recursos de otro usuario.");
        }
    }
}
