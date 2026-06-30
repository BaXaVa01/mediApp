package com.example.medifind_springv.modules.appointments.exception;

import org.springframework.http.HttpStatus;

public class AppointmentNotFoundException extends AppointmentException {
    public AppointmentNotFoundException(String message, HttpStatus status, String error) {
        super(message, status, error);
    }
}
