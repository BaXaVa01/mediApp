package com.example.medifind_springv.modules.catalog.repository;

import com.example.medifind_springv.modules.catalog.dto.SpecialtyCatalogItemDTO;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class SpecialtyCatalogRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public SpecialtyCatalogRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<SpecialtyCatalogItemDTO> findAllSpecialties() {
        String sql = "SELECT id, nombre, descripcion FROM especialidad ORDER BY nombre ASC";
        return jdbcTemplate.query(sql, new MapSqlParameterSource(), (rs, rowNum) -> {
            UUID uuid = (UUID) rs.getObject("id");
            return new SpecialtyCatalogItemDTO(
                    uuid != null ? uuid.toString() : "",
                    rs.getString("nombre"),
                    rs.getString("descripcion")
            );
        });
    }
}
