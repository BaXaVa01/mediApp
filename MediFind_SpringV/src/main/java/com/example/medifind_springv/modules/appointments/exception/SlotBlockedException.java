package com.example.medifind_springv.modules.appointments.exception;

import org.springframework.http.HttpStatus;

public class SlotBlockedException extends AppointmentException {
    public SlotBlockedException(String message) {
        super(message, HttpStatus.CONFLICT, "SLOT_BLOCKED");
    }
}
