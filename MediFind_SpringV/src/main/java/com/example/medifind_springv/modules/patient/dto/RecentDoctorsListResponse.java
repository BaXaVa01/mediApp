package com.example.medifind_springv.modules.patient.dto;

import java.util.ArrayList;
import java.util.List;

public class RecentDoctorsListResponse {
    private List<RecentDoctorResponse> items = new ArrayList<>();

    public RecentDoctorsListResponse() {}

    public RecentDoctorsListResponse(List<RecentDoctorResponse> items) {
        this.items = items != null ? items : new ArrayList<>();
    }

    public List<RecentDoctorResponse> getItems() {
        return items;
    }

    public void setItems(List<RecentDoctorResponse> items) {
        this.items = items != null ? items : new ArrayList<>();
    }
}
