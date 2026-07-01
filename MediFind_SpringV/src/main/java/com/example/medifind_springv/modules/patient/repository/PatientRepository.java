package com.example.medifind_springv.modules.patient.repository;

import com.example.medifind_springv.modules.patient.dto.PatientProfileResponse;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public class PatientRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public PatientRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean patientExists(UUID patientId) {
        String sql = "SELECT COUNT(*) FROM paciente WHERE id = :patientId";
        MapSqlParameterSource params = new MapSqlParameterSource("patientId", patientId);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public PatientProfileResponse findProfileById(UUID patientId) {
        String sql = "SELECT p.id AS patient_id, u.id AS user_id, u.nombre, u.email, u.telefono, " +
                "p.fecha_nacimiento, p.genero, p.direccion, p.foto_url, u.creado_en " +
                "FROM paciente p " +
                "JOIN usuario u ON p.usuario_id = u.id " +
                "WHERE p.id = :patientId";
        MapSqlParameterSource params = new MapSqlParameterSource("patientId", patientId);

        try {
            return jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> {
                Date birthDateSql = rs.getDate("fecha_nacimiento");
                String birthDateStr = birthDateSql != null ? birthDateSql.toString() : null;

                Timestamp createdAtSql = rs.getTimestamp("creado_en");
                String createdAtStr = createdAtSql != null ? createdAtSql.toLocalDateTime().toString() : null;

                String genderVal = rs.getString("genero");
                if (genderVal != null) {
                    genderVal = genderVal.toUpperCase();
                }

                String rawPhoto = rs.getString("foto_url");
                String publicPhotoUrl = "";
                if (rawPhoto != null && !rawPhoto.trim().isEmpty()) {
                    String trimmed = rawPhoto.trim();
                    if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
                        publicPhotoUrl = trimmed;
                    } else {
                        publicPhotoUrl = "/api/patients/" + rs.getString("patient_id") + "/photo";
                    }
                }

                return new PatientProfileResponse(
                        rs.getString("patient_id"),
                        rs.getString("user_id"),
                        rs.getString("nombre"),
                        rs.getString("email"),
                        rs.getString("telefono") != null ? rs.getString("telefono") : "",
                        birthDateStr,
                        genderVal,
                        rs.getString("direccion") != null ? rs.getString("direccion") : "",
                        publicPhotoUrl,
                        createdAtStr
                );
            });
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public UUID findUserIdByPatientId(UUID patientId) {
        String sql = "SELECT usuario_id FROM paciente WHERE id = :patientId";
        MapSqlParameterSource params = new MapSqlParameterSource("patientId", patientId);
        try {
            return jdbcTemplate.queryForObject(sql, params, UUID.class);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void updateUsuario(UUID userId, String name, String phone, LocalDateTime updatedAt) {
        String sql = "UPDATE usuario SET nombre = :name, telefono = :phone, actualizado_en = :updatedAt WHERE id = :userId";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("userId", userId)
                .addValue("name", name)
                .addValue("phone", phone)
                .addValue("updatedAt", Timestamp.valueOf(updatedAt));
        jdbcTemplate.update(sql, params);
    }

    public void updatePaciente(UUID patientId, LocalDate birthDate, String gender, String address) {
        String sql = "UPDATE paciente SET fecha_nacimiento = :birthDate, " +
                "genero = CAST(:gender AS genero_paciente), " +
                "direccion = :address WHERE id = :patientId";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("patientId", patientId)
                .addValue("birthDate", birthDate != null ? Date.valueOf(birthDate) : null)
                .addValue("gender", gender != null ? gender.toLowerCase() : null)
                .addValue("address", address);
        jdbcTemplate.update(sql, params);
    }

    public String findCurrentPhotoUrl(UUID patientId) {
        String sql = "SELECT foto_url FROM paciente WHERE id = :patientId";
        MapSqlParameterSource params = new MapSqlParameterSource("patientId", patientId);
        try {
            return jdbcTemplate.queryForObject(sql, params, String.class);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void updatePatientPhotoUrl(UUID patientId, String photoUrl) {
        String sql = "UPDATE paciente SET foto_url = :photoUrl WHERE id = :patientId";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("patientId", patientId)
                .addValue("photoUrl", photoUrl);
        jdbcTemplate.update(sql, params);
    }
}
