package com.example.medifind_springv.modules.profile.repository;

import com.example.medifind_springv.modules.profile.dto.DoctorLocationDTO;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public class DoctorLocationRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public DoctorLocationRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean doctorExists(UUID doctorId) {
        String sql = "SELECT COUNT(*) FROM doctor WHERE id = :doctorId";
        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public List<DoctorLocationDTO> getDoctorLocations(UUID doctorId) {
        String sql = "SELECT " +
                "la.id, " +
                "COALESCE(NULLIF(la.nombre, ''), c.nombre, '') AS name, " +
                "CAST(la.tipo_lugar AS TEXT) AS type, " +
                "COALESCE(NULLIF(la.direccion, ''), c.direccion, '') AS address, " +
                "COALESCE(NULLIF(la.ciudad, ''), c.ciudad, '') AS city, " +
                "la.clinica_id, " +
                "c.nombre AS clinic_name, " +
                "la.es_principal, " +
                "la.activo " +
                "FROM lugar_atencion la " +
                "LEFT JOIN clinica c ON la.clinica_id = c.id " +
                "LEFT JOIN doctor_clinica dc ON la.clinica_id = dc.clinica_id AND dc.doctor_id = :doctorId AND dc.activo = true " +
                "WHERE la.activo = true " +
                "AND (la.doctor_id = :doctorId OR dc.id IS NOT NULL) " +
                "ORDER BY la.es_principal DESC, name ASC";

        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> {
            UUID idUUID = (UUID) rs.getObject("id");
            UUID clinicIdUUID = (UUID) rs.getObject("clinica_id");
            String clinicName = rs.getString("clinic_name");
            if (clinicName == null) {
                clinicName = "";
            }

            return new DoctorLocationDTO(
                    idUUID != null ? idUUID.toString() : null,
                    rs.getString("name"),
                    rs.getString("type"),
                    rs.getString("address"),
                    rs.getString("city"),
                    clinicIdUUID != null ? clinicIdUUID.toString() : null,
                    clinicName,
                    rs.getBoolean("es_principal"),
                    rs.getBoolean("activo")
            );
        });
    }
}
