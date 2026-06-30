package com.example.medifind_springv.modules.appointments.dto;

import java.util.ArrayList;
import java.util.List;

public class PendingAppointmentsPageResponse {
    private Integer page;
    private Integer size;
    private Long totalElements;
    private Integer totalPages;
    private List<PendingAppointmentDTO> items = new ArrayList<>();

    public PendingAppointmentsPageResponse() {}

    public PendingAppointmentsPageResponse(Integer page, Integer size, Long totalElements, Integer totalPages, List<PendingAppointmentDTO> items) {
        this.page = page;
        this.size = size;
        this.totalElements = totalElements;
        this.totalPages = totalPages;
        this.items = items != null ? items : new ArrayList<>();
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getSize() {
        return size;
    }

    public void setSize(Integer size) {
        this.size = size;
    }

    public Long getTotalElements() {
        return totalElements;
    }

    public void setTotalElements(Long totalElements) {
        this.totalElements = totalElements;
    }

    public Integer getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(Integer totalPages) {
        this.totalPages = totalPages;
    }

    public List<PendingAppointmentDTO> getItems() {
        return items;
    }

    public void setItems(List<PendingAppointmentDTO> items) {
        this.items = items != null ? items : new ArrayList<>();
    }
}
