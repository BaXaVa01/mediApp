package com.example.medifind_springv.modules.patient.dto;

import java.util.ArrayList;
import java.util.List;

public class PatientAppointmentsPageResponse {
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    private List<PatientAppointmentDTO> items = new ArrayList<>();

    public PatientAppointmentsPageResponse() {}

    public PatientAppointmentsPageResponse(int page, int size, long totalElements, int totalPages, List<PatientAppointmentDTO> items) {
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.items = items != null ? items : new ArrayList<>();
    }

    public int getPage() {
        return page;
    }

    public void setPage(int page) {
        this.page = page;
    }

    public int getSize() {
        return size;
    }

    public void setSize(int size) {
        this.size = size;
    }

    public long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(long totalElements) {
        this.totalElements = totalElements;
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public List<PatientAppointmentDTO> getItems() {
        return items;
    }

    public void setItems(List<PatientAppointmentDTO> items) {
        this.items = items != null ? items : new ArrayList<>();
    }
}
