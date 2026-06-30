package com.example.medifind_springv.modules.profile.exception;

import java.util.Map;

public class ProfileValidationException extends RuntimeException {
    private final Map<String, String> fields;

    public ProfileValidationException(String message, Map<String, String> fields) {
        super(message);
        this.fields = fields;
    }

    public Map<String, String> getFields() {
        return fields;
    }
}
