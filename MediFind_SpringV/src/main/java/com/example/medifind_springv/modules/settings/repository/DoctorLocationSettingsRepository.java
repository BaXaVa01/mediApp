package com.example.medifind_springv.modules.settings.repository;

import com.example.medifind_springv.modules.settings.dto.DoctorLocationResponse;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public class DoctorLocationSettingsRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public DoctorLocationSettingsRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean doctorExists(UUID doctorId) {
        String sql = "SELECT COUNT(*) FROM doctor WHERE id = :doctorId";
        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public boolean hasAnyActiveLocation(UUID doctorId) {
        String sql = "SELECT COUNT(*) FROM lugar_atencion WHERE doctor_id = :doctorId AND activo = true";
        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public DoctorLocationResponse getLocationById(UUID locationId) {
        String sql = "SELECT " +
                "la.id, " +
                "la.doctor_id, " +
                "la.nombre, " +
                "la.direccion, " +
                "la.ciudad, " +
                "la.latitud, " +
                "la.longitud, " +
                "CAST(la.tipo_lugar AS TEXT) AS tipo_lugar, " +
                "la.clinica_id, " +
                "c.nombre AS clinic_name, " +
                "la.es_principal, " +
                "la.activo " +
                "FROM lugar_atencion la " +
                "LEFT JOIN clinica c ON la.clinica_id = c.id " +
                "WHERE la.id = :locationId";

        MapSqlParameterSource params = new MapSqlParameterSource("locationId", locationId);

        try {
            return jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> {
                UUID idUUID = (UUID) rs.getObject("id");
                UUID docIdUUID = (UUID) rs.getObject("doctor_id");
                UUID clinicIdUUID = (UUID) rs.getObject("clinica_id");
                String clinicName = rs.getString("clinic_name");
                BigDecimal lat = rs.getBigDecimal("latitud");
                BigDecimal lng = rs.getBigDecimal("longitud");

                return new DoctorLocationResponse(
                        idUUID != null ? idUUID.toString() : "",
                        docIdUUID != null ? docIdUUID.toString() : null,
                        rs.getString("nombre"),
                        rs.getString("direccion"),
                        rs.getString("ciudad"),
                        lat != null ? lat.doubleValue() : null,
                        lng != null ? lng.doubleValue() : null,
                        rs.getString("tipo_lugar") != null ? rs.getString("tipo_lugar").toUpperCase() : "",
                        clinicIdUUID != null ? clinicIdUUID.toString() : null,
                        clinicName != null ? clinicName : "",
                        rs.getBoolean("es_principal"),
                        rs.getBoolean("activo")
                );
            });
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void insertLocation(UUID id, UUID doctorId, String name, String address, String city, Double latitude, Double longitude, String type, boolean isMain) {
        String sql = "INSERT INTO lugar_atencion (id, doctor_id, clinica_id, nombre, direccion, ciudad, latitud, longitud, tipo_lugar, es_principal, activo, creado_en) " +
                "VALUES (:id, :doctorId, null, :name, :address, :city, :latitude, :longitude, CAST(:type AS tipo_lugar_atencion), :isMain, true, :createdAt)";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("doctorId", doctorId)
                .addValue("name", name)
                .addValue("address", address)
                .addValue("city", city)
                .addValue("latitude", latitude != null ? BigDecimal.valueOf(latitude) : null)
                .addValue("longitude", longitude != null ? BigDecimal.valueOf(longitude) : null)
                .addValue("type", type)
                .addValue("isMain", isMain)
                .addValue("createdAt", Timestamp.valueOf(LocalDateTime.now()));

        jdbcTemplate.update(sql, params);
    }

    public int updateLocation(UUID locationId, UUID doctorId, String name, String address, String city, Double latitude, Double longitude, String type, boolean isMain, boolean active) {
        String sql = "UPDATE lugar_atencion SET " +
                "nombre = :name, " +
                "direccion = :address, " +
                "ciudad = :city, " +
                "latitud = :latitude, " +
                "longitud = :longitude, " +
                "tipo_lugar = CAST(:type AS tipo_lugar_atencion), " +
                "es_principal = :isMain, " +
                "activo = :active " +
                "WHERE id = :locationId AND doctor_id = :doctorId";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("locationId", locationId)
                .addValue("doctorId", doctorId)
                .addValue("name", name)
                .addValue("address", address)
                .addValue("city", city)
                .addValue("latitude", latitude != null ? BigDecimal.valueOf(latitude) : null)
                .addValue("longitude", longitude != null ? BigDecimal.valueOf(longitude) : null)
                .addValue("type", type)
                .addValue("isMain", isMain)
                .addValue("active", active);

        return jdbcTemplate.update(sql, params);
    }

    public int softDeleteLocation(UUID locationId, UUID doctorId) {
        String sql = "UPDATE lugar_atencion SET activo = false, es_principal = false WHERE id = :locationId AND doctor_id = :doctorId";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("locationId", locationId)
                .addValue("doctorId", doctorId);

        return jdbcTemplate.update(sql, params);
    }

    public void clearAllPrincipals(UUID doctorId) {
        String sql = "UPDATE lugar_atencion SET es_principal = false WHERE doctor_id = :doctorId AND activo = true";
        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);
        jdbcTemplate.update(sql, params);
    }

    public int setLocationAsPrincipal(UUID locationId, UUID doctorId) {
        String sql = "UPDATE lugar_atencion SET es_principal = true WHERE id = :locationId AND doctor_id = :doctorId AND activo = true";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("locationId", locationId)
                .addValue("doctorId", doctorId);

        return jdbcTemplate.update(sql, params);
    }
}
