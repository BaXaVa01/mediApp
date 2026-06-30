package com.example.medifind_springv.modules.profile.exception;

public class InvalidProfileRequestException extends RuntimeException {
    private final String error;

    public InvalidProfileRequestException(String message, String error) {
        super(message);
        this.error = error;
    }

    public String getError() {
        return error;
    }
}
