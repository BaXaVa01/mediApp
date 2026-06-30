package com.example.medifind_springv.modules.appointments.exception;

import org.springframework.http.HttpStatus;

public class OutsideWorkingHoursException extends AppointmentException {
    public OutsideWorkingHoursException(String message) {
        super(message, HttpStatus.BAD_REQUEST, "OUTSIDE_WORKING_HOURS");
    }
}
