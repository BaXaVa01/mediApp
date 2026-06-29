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

        ApiErrorResponse response = new ApiErrorResponse(
                HttpStatus.BAD_REQUEST.value(),
                "VALIDATION_ERROR",
                "Datos de registro inválidos.",
                fields
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
}
