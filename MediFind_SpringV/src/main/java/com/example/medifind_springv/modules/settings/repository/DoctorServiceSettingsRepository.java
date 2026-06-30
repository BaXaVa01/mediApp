package com.example.medifind_springv.modules.settings.repository;

import com.example.medifind_springv.modules.settings.dto.DoctorServiceResponse;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Repository
public class DoctorServiceSettingsRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public DoctorServiceSettingsRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean doctorExists(UUID doctorId) {
        String sql = "SELECT COUNT(*) FROM doctor WHERE id = :doctorId";
        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public boolean isLocationValidForDoctor(UUID doctorId, UUID locationId) {
        String sql = "SELECT COUNT(*) FROM lugar_atencion la " +
                "LEFT JOIN doctor_clinica dc ON la.clinica_id = dc.clinica_id AND dc.doctor_id = :doctorId AND dc.activo = true " +
                "WHERE la.id = :locationId AND la.activo = true " +
                "AND (la.doctor_id = :doctorId OR dc.id IS NOT NULL)";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("doctorId", doctorId)
                .addValue("locationId", locationId);

        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public UUID getClinicIdForLocation(UUID locationId) {
        String sql = "SELECT clinica_id FROM lugar_atencion WHERE id = :locationId";
        MapSqlParameterSource params = new MapSqlParameterSource("locationId", locationId);
        try {
            return jdbcTemplate.queryForObject(sql, params, UUID.class);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public boolean isClinicValidForDoctor(UUID doctorId, UUID clinicId) {
        String sql = "SELECT COUNT(*) FROM doctor_clinica dc " +
                "WHERE dc.doctor_id = :doctorId AND dc.clinica_id = :clinicId AND dc.activo = true";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("doctorId", doctorId)
                .addValue("clinicId", clinicId);

        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public List<DoctorServiceResponse> listServices(UUID doctorId, boolean includeInactive) {
        String sql = "SELECT " +
                "s.id, " +
                "s.doctor_id, " +
                "s.nombre, " +
                "s.descripcion, " +
                "s.duracion_minutos, " +
                "s.precio, " +
                "s.lugar_atencion_id, " +
                "la.nombre AS location_name, " +
                "s.clinica_id, " +
                "c.nombre AS clinic_name, " +
                "s.activo " +
                "FROM servicio s " +
                "LEFT JOIN lugar_atencion la ON s.lugar_atencion_id = la.id " +
                "LEFT JOIN clinica c ON s.clinica_id = c.id " +
                "LEFT JOIN doctor_clinica dc ON s.clinica_id = dc.clinica_id AND dc.doctor_id = :doctorId AND dc.activo = true " +
                "WHERE (s.doctor_id = :doctorId OR dc.id IS NOT NULL) " +
                "AND (:includeInactive = true OR s.activo = true) " +
                "ORDER BY s.activo DESC, s.nombre ASC";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("doctorId", doctorId)
                .addValue("includeInactive", includeInactive);

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> {
            UUID idUUID = (UUID) rs.getObject("id");
            UUID docIdUUID = (UUID) rs.getObject("doctor_id");
            UUID locIdUUID = (UUID) rs.getObject("lugar_atencion_id");
            UUID clinicIdUUID = (UUID) rs.getObject("clinica_id");
            String desc = rs.getString("descripcion");
            String locName = rs.getString("location_name");
            String clinName = rs.getString("clinic_name");

            return new DoctorServiceResponse(
                    idUUID != null ? idUUID.toString() : "",
                    docIdUUID != null ? docIdUUID.toString() : null,
                    rs.getString("nombre"),
                    desc != null ? desc : "",
                    rs.getInt("duracion_minutos"),
                    rs.getDouble("precio"),
                    locIdUUID != null ? locIdUUID.toString() : null,
                    locName != null ? locName : "",
                    clinicIdUUID != null ? clinicIdUUID.toString() : null,
                    clinName != null ? clinName : "",
                    rs.getBoolean("activo")
            );
        });
    }

    public DoctorServiceResponse getServiceDetail(UUID doctorId, UUID serviceId) {
        String sql = "SELECT " +
                "s.id, " +
                "s.doctor_id, " +
                "s.nombre, " +
                "s.descripcion, " +
                "s.duracion_minutos, " +
                "s.precio, " +
                "s.lugar_atencion_id, " +
                "la.nombre AS location_name, " +
                "s.clinica_id, " +
                "c.nombre AS clinic_name, " +
                "s.activo " +
                "FROM servicio s " +
                "LEFT JOIN lugar_atencion la ON s.lugar_atencion_id = la.id " +
                "LEFT JOIN clinica c ON s.clinica_id = c.id " +
                "LEFT JOIN doctor_clinica dc ON s.clinica_id = dc.clinica_id AND dc.doctor_id = :doctorId AND dc.activo = true " +
                "WHERE s.id = :serviceId " +
                "AND (s.doctor_id = :doctorId OR dc.id IS NOT NULL)";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("doctorId", doctorId)
                .addValue("serviceId", serviceId);

        try {
            return jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> {
                UUID idUUID = (UUID) rs.getObject("id");
                UUID docIdUUID = (UUID) rs.getObject("doctor_id");
                UUID locIdUUID = (UUID) rs.getObject("lugar_atencion_id");
                UUID clinicIdUUID = (UUID) rs.getObject("clinica_id");
                String desc = rs.getString("descripcion");
                String locName = rs.getString("location_name");
                String clinName = rs.getString("clinic_name");

                return new DoctorServiceResponse(
                        idUUID != null ? idUUID.toString() : "",
                        docIdUUID != null ? docIdUUID.toString() : null,
                        rs.getString("nombre"),
                        desc != null ? desc : "",
                        rs.getInt("duracion_minutos"),
                        rs.getDouble("precio"),
                        locIdUUID != null ? locIdUUID.toString() : null,
                        locName != null ? locName : "",
                        clinicIdUUID != null ? clinicIdUUID.toString() : null,
                        clinName != null ? clinName : "",
                        rs.getBoolean("activo")
                );
            });
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void insertService(UUID id, UUID doctorId, UUID clinicId, UUID locationId, String name, String description, int durationMinutes, Double price) {
        String sql = "INSERT INTO servicio (id, doctor_id, clinica_id, lugar_atencion_id, nombre, descripcion, duracion_minutos, precio, activo) " +
                "VALUES (:id, :doctorId, :clinicId, :locationId, :name, :description, :durationMinutes, :price, true)";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("doctorId", doctorId)
                .addValue("clinicId", clinicId)
                .addValue("locationId", locationId)
                .addValue("name", name)
                .addValue("description", description)
                .addValue("durationMinutes", durationMinutes)
                .addValue("price", price != null ? BigDecimal.valueOf(price) : BigDecimal.ZERO);

        jdbcTemplate.update(sql, params);
    }

    public int updateService(UUID serviceId, UUID doctorId, UUID clinicId, UUID locationId, String name, String description, int durationMinutes, Double price, boolean active) {
        String sql = "UPDATE servicio SET " +
                "nombre = :name, " +
                "descripcion = :description, " +
                "duracion_minutos = :durationMinutes, " +
                "precio = :price, " +
                "lugar_atencion_id = :locationId, " +
                "clinica_id = :clinicId, " +
                "activo = :active " +
                "WHERE id = :serviceId " +
                "AND (doctor_id = :doctorId OR clinica_id IN (" +
                "SELECT dc.clinica_id FROM doctor_clinica dc WHERE dc.doctor_id = :doctorId AND dc.activo = true" +
                "))";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("serviceId", serviceId)
                .addValue("doctorId", doctorId)
                .addValue("clinicId", clinicId)
                .addValue("locationId", locationId)
                .addValue("name", name)
                .addValue("description", description)
                .addValue("durationMinutes", durationMinutes)
                .addValue("price", price != null ? BigDecimal.valueOf(price) : BigDecimal.ZERO)
                .addValue("active", active);

        return jdbcTemplate.update(sql, params);
    }

    public int softDeleteService(UUID serviceId, UUID doctorId) {
        String sql = "UPDATE servicio SET activo = false " +
                "WHERE id = :serviceId " +
                "AND (doctor_id = :doctorId OR clinica_id IN (" +
                "SELECT dc.clinica_id FROM doctor_clinica dc WHERE dc.doctor_id = :doctorId AND dc.activo = true" +
                "))";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("serviceId", serviceId)
                .addValue("doctorId", doctorId);

        return jdbcTemplate.update(sql, params);
    }
}
