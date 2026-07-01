package com.example.medifind_springv.modules.auth.exception;

public class ResourceNotOwnedException extends RuntimeException {
    public ResourceNotOwnedException(String message) {
        super(message);
    }
}
