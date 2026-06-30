package com.example.medifind_springv.modules.profile.repository;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Repository
public class DoctorProfilePhotoRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public DoctorProfilePhotoRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean doctorExists(UUID doctorId) {
        String sql = "SELECT COUNT(*) FROM doctor WHERE id = :doctorId";
        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public String findCurrentPhotoUrl(UUID doctorId) {
        String sql = "SELECT foto_url FROM doctor WHERE id = :doctorId";
        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);
        try {
            return jdbcTemplate.queryForObject(sql, params, String.class);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void updateDoctorPhotoUrl(UUID doctorId, String photoUrl) {
        String sql = "UPDATE doctor SET foto_url = :photoUrl, actualizado_en = :updatedAt WHERE id = :doctorId";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("doctorId", doctorId)
                .addValue("photoUrl", photoUrl)
                .addValue("updatedAt", Timestamp.valueOf(LocalDateTime.now()));

        jdbcTemplate.update(sql, params);
    }
}
