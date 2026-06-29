package com.example.medifind_springv.modules.auth.exception;

public class InvalidRegisterRequestException extends RuntimeException {
    private final String errorCode;

    public InvalidRegisterRequestException(String message, String errorCode) {
        super(message);
        this.errorCode = errorCode;
    }

    public String getErrorCode() {
        return errorCode;
    }
}
