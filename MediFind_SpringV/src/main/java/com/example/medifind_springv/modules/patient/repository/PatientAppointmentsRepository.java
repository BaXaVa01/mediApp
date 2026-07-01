package com.example.medifind_springv.modules.patient.repository;

import com.example.medifind_springv.modules.patient.dto.*;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
public class PatientAppointmentsRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public PatientAppointmentsRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public long countAppointments(UUID patientId, String dbStatus) {
        String sql = "SELECT COUNT(*) FROM cita WHERE paciente_id = :patientId";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("patientId", patientId);

        if (dbStatus != null && !dbStatus.trim().isEmpty()) {
            sql += " AND estado = CAST(:status AS estado_cita)";
            params.addValue("status", dbStatus.trim());
        }

        Long count = jdbcTemplate.queryForObject(sql, params, Long.class);
        return count != null ? count : 0;
    }

    public List<PatientAppointmentDTO> findAppointments(UUID patientId, String dbStatus, int limit, int offset) {
        String sql = "SELECT c.id AS cita_id, c.fecha, c.hora_inicio, c.hora_fin, c.estado, c.motivo_consulta, c.notas, c.precio_reservado, c.creado_en, c.actualizado_en, " +
                "d.id AS doctor_id, d.nombre_profesional AS doctor_name, d.headline AS doctor_headline, d.foto_url AS doctor_photo, " +
                "(SELECT es.nombre FROM doctor_especialidad de JOIN especialidad es ON de.especialidad_id = es.id WHERE de.doctor_id = d.id ORDER BY es.nombre ASC LIMIT 1) AS specialty_name, " +
                "s.id AS servicio_id, s.nombre AS servicio_name, s.duracion_minutos AS servicio_duration, s.precio AS servicio_price, " +
                "la.id AS lugar_id, la.nombre AS lugar_name, la.tipo_lugar AS lugar_type, la.direccion AS lugar_address, la.ciudad AS lugar_city, la.latitud AS lugar_lat, la.longitud AS lugar_lng " +
                "FROM cita c " +
                "JOIN doctor d ON c.doctor_id = d.id " +
                "JOIN lugar_atencion la ON c.lugar_atencion_id = la.id " +
                "LEFT JOIN servicio s ON c.servicio_id = s.id " +
                "WHERE c.paciente_id = :patientId";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("patientId", patientId)
                .addValue("limit", limit)
                .addValue("offset", offset);

        if (dbStatus != null && !dbStatus.trim().isEmpty()) {
            sql += " AND c.estado = CAST(:status AS estado_cita)";
            params.addValue("status", dbStatus.trim());
        }

        sql += " ORDER BY c.fecha DESC, c.hora_inicio DESC LIMIT :limit OFFSET :offset";

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> {
            String apptId = rs.getString("cita_id");
            Date dateSql = rs.getDate("fecha");
            LocalDate localDate = dateSql != null ? dateSql.toLocalDate() : null;

            Time startTimeSql = rs.getTime("hora_inicio");
            LocalTime localStartTime = startTimeSql != null ? startTimeSql.toLocalTime() : null;

            Time endTimeSql = rs.getTime("hora_fin");
            LocalTime localEndTime = endTimeSql != null ? endTimeSql.toLocalTime() : null;

            String statusDb = rs.getString("estado");
            String statusUpper = statusDb != null ? statusDb.toUpperCase() : "";
            
            // Map to response format
            String responseStatus = mapDbStatusToResponse(statusUpper);
            String responseStatusLabel = mapDbStatusToLabel(statusUpper);

            Timestamp createdAtSql = rs.getTimestamp("creado_en");
            String createdAtStr = createdAtSql != null ? createdAtSql.toLocalDateTime().toString() : null;

            Timestamp updatedAtSql = rs.getTimestamp("actualizado_en");
            String updatedAtStr = updatedAtSql != null ? updatedAtSql.toLocalDateTime().toString() : null;

            boolean canCancel = checkIfCanCancel(localDate, localStartTime, statusDb);

            // Doctor details
            String rawDocPhoto = rs.getString("doctor_photo");
            String docPhotoUrl = "";
            if (rawDocPhoto != null && !rawDocPhoto.trim().isEmpty()) {
                String trimmed = rawDocPhoto.trim();
                if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
                    docPhotoUrl = trimmed;
                } else {
                    docPhotoUrl = "/api/professionals/" + rs.getString("doctor_id") + "/photo";
                }
            }
            PatientAppointmentDoctorDTO doctorDTO = new PatientAppointmentDoctorDTO(
                    rs.getString("doctor_id"),
                    rs.getString("doctor_name"),
                    rs.getString("specialty_name"),
                    rs.getString("doctor_headline"),
                    docPhotoUrl
            );

            // Service details
            PatientAppointmentServiceDTO serviceDTO = null;
            String serviceId = rs.getString("servicio_id");
            if (serviceId != null) {
                serviceDTO = new PatientAppointmentServiceDTO(
                        serviceId,
                        rs.getString("servicio_name"),
                        rs.getInt("servicio_duration"),
                        rs.getDouble("servicio_price")
                );
            }

            // Location details
            PatientAppointmentLocationDTO locationDTO = new PatientAppointmentLocationDTO(
                    rs.getString("lugar_id"),
                    rs.getString("lugar_name"),
                    rs.getString("lugar_type"),
                    rs.getString("lugar_address"),
                    rs.getString("lugar_city"),
                    rs.getDouble("lugar_lat"),
                    rs.getDouble("lugar_lng")
            );

            return new PatientAppointmentDTO(
                    apptId,
                    localDate != null ? localDate.toString() : "",
                    localStartTime != null ? localStartTime.toString().substring(0, 5) : "",
                    localEndTime != null ? localEndTime.toString().substring(0, 5) : "",
                    responseStatus,
                    responseStatusLabel,
                    rs.getString("motivo_consulta"),
                    rs.getString("notas"),
                    rs.getDouble("precio_reservado"),
                    createdAtStr,
                    updatedAtStr,
                    canCancel,
                    doctorDTO,
                    serviceDTO,
                    locationDTO
            );
        });
    }

    public boolean appointmentExists(UUID appointmentId) {
        String sql = "SELECT COUNT(*) FROM cita WHERE id = :id";
        MapSqlParameterSource params = new MapSqlParameterSource("id", appointmentId);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public UUID findPatientIdByAppointmentId(UUID appointmentId) {
        String sql = "SELECT paciente_id FROM cita WHERE id = :id";
        MapSqlParameterSource params = new MapSqlParameterSource("id", appointmentId);
        try {
            return jdbcTemplate.queryForObject(sql, params, UUID.class);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public String findAppointmentStatus(UUID appointmentId) {
        String sql = "SELECT estado FROM cita WHERE id = :id";
        MapSqlParameterSource params = new MapSqlParameterSource("id", appointmentId);
        try {
            return jdbcTemplate.queryForObject(sql, params, String.class);
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public LocalDate findAppointmentDate(UUID appointmentId) {
        String sql = "SELECT fecha FROM cita WHERE id = :id";
        MapSqlParameterSource params = new MapSqlParameterSource("id", appointmentId);
        try {
            Date d = jdbcTemplate.queryForObject(sql, params, Date.class);
            return d != null ? d.toLocalDate() : null;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public LocalTime findAppointmentStartTime(UUID appointmentId) {
        String sql = "SELECT hora_inicio FROM cita WHERE id = :id";
        MapSqlParameterSource params = new MapSqlParameterSource("id", appointmentId);
        try {
            Time t = jdbcTemplate.queryForObject(sql, params, Time.class);
            return t != null ? t.toLocalTime() : null;
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void updateAppointmentStatus(UUID appointmentId, String dbStatus, String reason, LocalDateTime updatedAt) {
        String sql = "UPDATE cita SET estado = CAST(:status AS estado_cita), notas = CONCAT(COALESCE(notas, ''), :reason), actualizado_en = :updatedAt WHERE id = :id";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", appointmentId)
                .addValue("status", dbStatus)
                .addValue("reason", reason != null && !reason.trim().isEmpty() ? "\n[Cancelación]: " + reason.trim() : "")
                .addValue("updatedAt", Timestamp.valueOf(updatedAt));
        jdbcTemplate.update(sql, params);
    }

    private boolean checkIfCanCancel(LocalDate date, LocalTime startTime, String status) {
        if ("completada".equalsIgnoreCase(status) || "cancelada".equalsIgnoreCase(status) || "rechazada".equalsIgnoreCase(status)) {
            return false;
        }
        if (date == null || startTime == null) {
            return true;
        }
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        if (date.isAfter(today)) {
            return true;
        } else if (date.isEqual(today)) {
            return startTime.isAfter(now);
        }
        return false;
    }

    private String mapDbStatusToResponse(String dbStatusUpper) {
        switch (dbStatusUpper) {
            case "PENDIENTE":
                return "PENDING";
            case "CONFIRMADA":
                return "CONFIRMED";
            case "CANCELADA":
                return "CANCELLED";
            case "COMPLETADA":
                return "COMPLETED";
            case "BLOQUEADA":
                return "BLOCKED";
            default:
                return dbStatusUpper;
        }
    }

    private String mapDbStatusToLabel(String dbStatusUpper) {
        switch (dbStatusUpper) {
            case "PENDIENTE":
                return "Pendiente";
            case "CONFIRMADA":
                return "Aprobada";
            case "CANCELADA":
                return "Cancelada";
            case "COMPLETADA":
                return "Completada";
            case "BLOQUEADA":
                return "Bloqueada";
            default:
                return dbStatusUpper;
        }
    }
}
