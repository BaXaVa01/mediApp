package com.example.medifind_springv.modules.settings.repository;

import com.example.medifind_springv.modules.settings.dto.DoctorScheduleBlockDTO;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Time;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public class DoctorScheduleSettingsRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public DoctorScheduleSettingsRepository(NamedParameterJdbcTemplate jdbcTemplate) {
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

    public List<DoctorScheduleBlockDTO> getDoctorActiveSchedule(UUID doctorId) {
        String sql = "SELECT " +
                "ha.id, " +
                "ha.doctor_id, " +
                "ha.lugar_atencion_id, " +
                "la.nombre AS location_name, " +
                "ha.dia_semana, " +
                "ha.hora_inicio, " +
                "ha.hora_fin, " +
                "ha.duracion_cita_minutos, " +
                "ha.activo " +
                "FROM horario_atencion ha " +
                "JOIN lugar_atencion la ON ha.lugar_atencion_id = la.id " +
                "WHERE ha.doctor_id = :doctorId " +
                "AND ha.activo = true " +
                "ORDER BY ha.dia_semana ASC, ha.hora_inicio ASC";

        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> {
            UUID idUUID = (UUID) rs.getObject("id");
            UUID locIdUUID = (UUID) rs.getObject("lugar_atencion_id");
            Time startVal = rs.getTime("hora_inicio");
            Time endVal = rs.getTime("hora_fin");

            return new DoctorScheduleBlockDTO(
                    idUUID != null ? idUUID.toString() : "",
                    locIdUUID != null ? locIdUUID.toString() : "",
                    rs.getString("location_name"),
                    startVal != null ? formatTime(startVal.toLocalTime()) : "",
                    endVal != null ? formatTime(endVal.toLocalTime()) : "",
                    rs.getInt("duracion_cita_minutos"),
                    rs.getBoolean("activo"),
                    rs.getInt("dia_semana")
            );
        });
    }

    public void deactivateAllSchedules(UUID doctorId) {
        String sql = "UPDATE horario_atencion SET activo = false WHERE doctor_id = :doctorId";
        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);
        jdbcTemplate.update(sql, params);
    }

    public void insertScheduleBlock(UUID id, UUID doctorId, UUID locationId, int dayOfWeek, LocalTime startTime, LocalTime endTime, int durationMinutes) {
        String sql = "INSERT INTO horario_atencion (id, doctor_id, lugar_atencion_id, dia_semana, hora_inicio, hora_fin, duracion_cita_minutos, activo) " +
                "VALUES (:id, :doctorId, :locationId, :dayOfWeek, :startTime, :endTime, :durationMinutes, true)";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("doctorId", doctorId)
                .addValue("locationId", locationId)
                .addValue("dayOfWeek", dayOfWeek)
                .addValue("startTime", Time.valueOf(startTime))
                .addValue("endTime", Time.valueOf(endTime))
                .addValue("durationMinutes", durationMinutes);

        jdbcTemplate.update(sql, params);
    }

    private String formatTime(LocalTime time) {
        if (time == null) return "";
        return String.format("%02d:%02d", time.getHour(), time.getMinute());
    }
}
