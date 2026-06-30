package com.example.medifind_springv.modules.appointments.dto;

import java.util.ArrayList;
import java.util.List;

public class AppointmentAvailabilityResponse {
    private String doctorId;
    private String date;
    private String serviceId;
    private String locationId;
    private List<AppointmentSlotDTO> slots = new ArrayList<>();

    public AppointmentAvailabilityResponse() {}

    public AppointmentAvailabilityResponse(String doctorId, String date, String serviceId, String locationId, List<AppointmentSlotDTO> slots) {
        this.doctorId = doctorId;
        this.date = date;
        this.serviceId = serviceId;
        this.locationId = locationId;
        this.slots = slots != null ? slots : new ArrayList<>();
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getLocationId() {
        return locationId;
    }

    public void setLocationId(String locationId) {
        this.locationId = locationId;
    }

    public List<AppointmentSlotDTO> getSlots() {
        return slots;
    }

    public void setSlots(List<AppointmentSlotDTO> slots) {
        this.slots = slots != null ? slots : new ArrayList<>();
    }
}
