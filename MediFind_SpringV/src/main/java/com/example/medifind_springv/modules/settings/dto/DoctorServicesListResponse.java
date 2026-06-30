package com.example.medifind_springv.modules.settings.dto;

import java.util.ArrayList;
import java.util.List;

public class DoctorServicesListResponse {
    private String doctorId;
    private List<DoctorServiceResponse> services = new ArrayList<>();

    public DoctorServicesListResponse() {}

    public DoctorServicesListResponse(String doctorId, List<DoctorServiceResponse> services) {
        this.doctorId = doctorId;
        this.services = services != null ? services : new ArrayList<>();
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public List<DoctorServiceResponse> getServices() {
        return services;
    }

    public void setServices(List<DoctorServiceResponse> services) {
        this.services = services != null ? services : new ArrayList<>();
    }
}
