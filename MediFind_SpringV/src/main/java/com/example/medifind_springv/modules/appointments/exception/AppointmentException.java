package com.example.medifind_springv.modules.appointments.exception;

import org.springframework.http.HttpStatus;

public class AppointmentException extends RuntimeException {
    private final HttpStatus status;
    private final String error;

    public AppointmentException(String message, HttpStatus status, String error) {
        super(message);
        this.status = status;
        this.error = error;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getError() {
        return error;
    }
}
