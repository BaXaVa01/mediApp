package com.example.medifind_springv.modules.auth.exception;

import com.example.medifind_springv.modules.auth.dto.ApiErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<ApiErrorResponse> handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
        ApiErrorResponse response = new ApiErrorResponse(
                HttpStatus.CONFLICT.value(),
                "EMAIL_ALREADY_EXISTS",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(InvalidRegisterRequestException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidRegisterRequest(InvalidRegisterRequestException ex) {
        ApiErrorResponse response = new ApiErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                ex.getErrorCode(),
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        Map<String, String> fields = new HashMap<>();
        
        ex.getBindingResult().getAllErrors().forEach(error -> {
            if (error instanceof FieldError) {
                FieldError fieldError = (FieldError) error;
                String fieldName = fieldError.getField();
                
                // Map AssertTrue validation names to camelCase properties for React components
                if ("passwordStrong".equals(fieldName)) {
                    fieldName = "password";
                } else if ("professionalNameValid".equals(fieldName)) {
                    fieldName = "professionalName";
                } else if ("birthDateValid".equals(fieldName)) {
                    fieldName = "birthDate";
                }
                
                fields.put(fieldName, fieldError.getDefaultMessage());
            } else {
                fields.put(error.getObjectName(), error.getDefaultMessage());
            }
        });

        String message = "Datos de registro inválidos.";
        if (ex.getBindingResult().getObjectName().contains("CreateAppointmentRequest")) {
            message = "Datos inválidos para reservar la cita.";
        } else if (ex.getBindingResult().getObjectName().contains("LoginRequest")) {
            message = "Datos de login inválidos.";
        }

        ApiErrorResponse response = new ApiErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "VALIDATION_ERROR",
                message,
                fields
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(com.example.medifind_springv.modules.appointments.exception.AppointmentException.class)
    public ResponseEntity<ApiErrorResponse> handleAppointmentException(
            com.example.medifind_springv.modules.appointments.exception.AppointmentException ex) {
        ApiErrorResponse response = new ApiErrorResponse(
                ex.getStatus().value(),
                ex.getError(),
                ex.getMessage()
        );
        return ResponseEntity.status(ex.getStatus()).body(response);
    }

    @ExceptionHandler(com.example.medifind_springv.modules.profile.exception.DoctorNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleDoctorNotFound(
            com.example.medifind_springv.modules.profile.exception.DoctorNotFoundException ex) {
        ApiErrorResponse response = new ApiErrorResponse(
                org.springframework.http.HttpStatus.NOT_FOUND.value(),
                "DOCTOR_NOT_FOUND",
                ex.getMessage()
        );
        return ResponseEntity.status(org.springframework.http.HttpStatus.NOT_FOUND).body(response);
    }

    @ExceptionHandler(com.example.medifind_springv.modules.profile.exception.InvalidDoctorIdException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidDoctorId(
            com.example.medifind_springv.modules.profile.exception.InvalidDoctorIdException ex) {
        ApiErrorResponse response = new ApiErrorResponse(
                org.springframework.http.HttpStatus.BAD_REQUEST.value(),
                "INVALID_DOCTOR_ID",
                ex.getMessage()
        );
        return ResponseEntity.status(org.springframework.http.HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(com.example.medifind_springv.modules.auth.exception.InvalidCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidCredentials(
            com.example.medifind_springv.modules.auth.exception.InvalidCredentialsException ex) {
        ApiErrorResponse response = new ApiErrorResponse(
                HttpStatus.UNAUTHORIZED.value(),
                "INVALID_CREDENTIALS",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(com.example.medifind_springv.modules.auth.exception.UserInactiveException.class)
    public ResponseEntity<ApiErrorResponse> handleUserInactive(
            com.example.medifind_springv.modules.auth.exception.UserInactiveException ex) {
        ApiErrorResponse response = new ApiErrorResponse(
                HttpStatus.FORBIDDEN.value(),
                "USER_INACTIVE",
                ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }
}
