package com.example.medifind_springv.modules.catalog.dto;

public class SpecialtyCatalogItemDTO {
    private String id;
    private String name;
    private String description;

    public SpecialtyCatalogItemDTO() {}

    public SpecialtyCatalogItemDTO(String id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description != null ? description : "";
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description != null ? description : "";
    }
}
