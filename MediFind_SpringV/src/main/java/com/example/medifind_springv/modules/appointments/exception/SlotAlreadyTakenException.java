package com.example.medifind_springv.modules.appointments.exception;

import org.springframework.http.HttpStatus;

public class SlotAlreadyTakenException extends AppointmentException {
    public SlotAlreadyTakenException(String message) {
        super(message, HttpStatus.CONFLICT, "SLOT_ALREADY_TAKEN");
    }
}
