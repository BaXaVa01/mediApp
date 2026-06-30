package com.example.medifind_springv.modules.appointments.dto;

public class CalendarCaseDTO {
    private String serviceId;
    private String serviceName;
    private String reason;
    private String notes;
    private Double reservedPrice;

    public CalendarCaseDTO() {}

    public CalendarCaseDTO(String serviceId, String serviceName, String reason, String notes, Double reservedPrice) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.reason = reason;
        this.notes = notes;
        this.reservedPrice = reservedPrice;
    }

    public String getServiceId() {
        return serviceId;
    }

    public void setServiceId(String serviceId) {
        this.serviceId = serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Double getReservedPrice() {
        return reservedPrice;
    }

    public void setReservedPrice(Double reservedPrice) {
        this.reservedPrice = reservedPrice;
    }
}
