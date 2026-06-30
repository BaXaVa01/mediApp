package com.example.medifind_springv.modules.profile.exception;

public class InvalidDoctorIdException extends RuntimeException {
    public InvalidDoctorIdException(String message) {
        super(message);
    }
}
