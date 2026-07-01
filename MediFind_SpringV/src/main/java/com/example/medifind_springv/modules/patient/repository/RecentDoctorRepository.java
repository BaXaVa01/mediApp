package com.example.medifind_springv.modules.patient.repository;

import com.example.medifind_springv.modules.patient.dto.RecentDoctorResponse;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.List;
import java.util.UUID;

@Repository
public class RecentDoctorRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public RecentDoctorRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void upsertRecentDoctor(UUID id, UUID patientId, UUID doctorId) {
        String sql = "INSERT INTO paciente_doctor_reciente (id, paciente_id, doctor_id, visto_en) " +
                "VALUES (:id, :patientId, :doctorId, now()) " +
                "ON CONFLICT (paciente_id, doctor_id) " +
                "DO UPDATE SET visto_en = now()";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("patientId", patientId)
                .addValue("doctorId", doctorId);
        jdbcTemplate.update(sql, params);
    }

    public List<RecentDoctorResponse> findRecentDoctors(UUID patientId, int limit) {
        String sql = "SELECT r.doctor_id, d.nombre_profesional, d.headline, d.foto_url, d.ciudad, d.resumen_ubicacion, r.visto_en, " +
                "(SELECT es.nombre FROM doctor_especialidad de JOIN especialidad es ON de.especialidad_id = es.id WHERE de.doctor_id = d.id ORDER BY es.nombre ASC LIMIT 1) AS specialty_name, " +
                "COALESCE((SELECT AVG(calificacion) FROM review WHERE doctor_id = d.id), 0.0) AS rating, " +
                "(SELECT COUNT(*) FROM review WHERE doctor_id = d.id) AS review_count, " +
                "COALESCE((SELECT MIN(precio) FROM servicio WHERE doctor_id = d.id AND activo = true), 0.0) AS base_price " +
                "FROM paciente_doctor_reciente r " +
                "JOIN doctor d ON r.doctor_id = d.id " +
                "WHERE r.paciente_id = :patientId " +
                "  AND d.perfil_visible = true " +
                "ORDER BY r.visto_en DESC " +
                "LIMIT :limit";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("patientId", patientId)
                .addValue("limit", limit);

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> {
            String doctorIdStr = rs.getString("doctor_id");
            String rawPhoto = rs.getString("foto_url");
            String publicPhotoUrl = "";
            if (rawPhoto != null && !rawPhoto.trim().isEmpty()) {
                String trimmed = rawPhoto.trim();
                if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
                    publicPhotoUrl = trimmed;
                } else {
                    publicPhotoUrl = "/api/professionals/" + doctorIdStr + "/photo";
                }
            }

            Timestamp seenAt = rs.getTimestamp("visto_en");
            String seenAtStr = seenAt != null ? seenAt.toLocalDateTime().toString() : null;

            // Round rating to 1 decimal place
            double avgRating = rs.getDouble("rating");
            avgRating = Math.round(avgRating * 10.0) / 10.0;

            return new RecentDoctorResponse(
                    doctorIdStr,
                    rs.getString("nombre_profesional"),
                    rs.getString("specialty_name"),
                    rs.getString("headline"),
                    publicPhotoUrl,
                    rs.getString("ciudad"),
                    rs.getString("resumen_ubicacion"),
                    avgRating,
                    rs.getInt("review_count"),
                    rs.getDouble("base_price"),
                    seenAtStr
            );
        });
    }

    public boolean doctorExists(UUID doctorId) {
        String sql = "SELECT COUNT(*) FROM doctor WHERE id = :id";
        MapSqlParameterSource params = new MapSqlParameterSource("id", doctorId);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }
}
