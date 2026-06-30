package com.example.medifind_springv.modules.appointments.repository;

import com.example.medifind_springv.modules.appointments.dto.*;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public class DoctorAppointmentRequestRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public DoctorAppointmentRequestRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean doctorExists(UUID doctorId) {
        String sql = "SELECT COUNT(*) FROM doctor WHERE id = :doctorId";
        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public long countPendingAppointments(UUID doctorId, String pendingStatus) {
        String sql = "SELECT COUNT(*) FROM cita c " +
                "WHERE c.doctor_id = :doctorId " +
                "AND c.estado = CAST(:pendingStatus AS estado_cita) " +
                "AND (c.fecha > CURRENT_DATE OR (c.fecha = CURRENT_DATE AND c.hora_inicio > CURRENT_TIME))";
        
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("doctorId", doctorId)
                .addValue("pendingStatus", pendingStatus);

        Long count = jdbcTemplate.queryForObject(sql, params, Long.class);
        return count != null ? count : 0L;
    }

    public List<PendingAppointmentDTO> getPendingAppointments(UUID doctorId, String pendingStatus, int limit, int offset) {
        String sql = "SELECT " +
                "c.id AS appointment_id, " +
                "c.fecha, " +
                "c.hora_inicio, " +
                "c.hora_fin, " +
                "CAST(c.estado AS TEXT) AS estado, " +
                "c.motivo_consulta, " +
                "c.notas, " +
                "c.precio_reservado, " +
                "p.id AS paciente_id, " +
                "u.nombre AS paciente_nombre, " +
                "u.email AS paciente_email, " +
                "u.telefono AS paciente_telefono, " +
                "s.id AS servicio_id, " +
                "s.nombre AS servicio_nombre, " +
                "la.id AS lugar_id, " +
                "la.nombre AS lugar_nombre, " +
                "CAST(la.tipo_lugar AS TEXT) AS lugar_tipo, " +
                "la.direccion AS lugar_direccion, " +
                "la.ciudad AS lugar_ciudad, " +
                "cl.id AS clinica_id, " +
                "cl.nombre AS clinica_nombre " +
                "FROM cita c " +
                "JOIN paciente p ON c.paciente_id = p.id " +
                "JOIN usuario u ON p.usuario_id = u.id " +
                "LEFT JOIN servicio s ON c.servicio_id = s.id " +
                "JOIN lugar_atencion la ON c.lugar_atencion_id = la.id " +
                "LEFT JOIN clinica cl ON c.clinica_id = cl.id " +
                "WHERE c.doctor_id = :doctorId " +
                "AND c.estado = CAST(:pendingStatus AS estado_cita) " +
                "AND (c.fecha > CURRENT_DATE OR (c.fecha = CURRENT_DATE AND c.hora_inicio > CURRENT_TIME)) " +
                "ORDER BY c.fecha ASC, c.hora_inicio ASC " +
                "LIMIT :limit OFFSET :offset";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("doctorId", doctorId)
                .addValue("pendingStatus", pendingStatus)
                .addValue("limit", limit)
                .addValue("offset", offset);

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> {
            UUID appointmentId = (UUID) rs.getObject("appointment_id");
            Date dateVal = rs.getDate("fecha");
            Time startTimeVal = rs.getTime("hora_inicio");
            Time endTimeVal = rs.getTime("hora_fin");

            // Patient
            UUID patientId = (UUID) rs.getObject("paciente_id");
            String phone = rs.getString("paciente_telefono");
            PendingPatientDTO patient = new PendingPatientDTO(
                    patientId != null ? patientId.toString() : "",
                    rs.getString("paciente_nombre"),
                    rs.getString("paciente_email"),
                    phone != null ? phone : ""
            );

            // Case/Service
            UUID serviceId = (UUID) rs.getObject("servicio_id");
            String serviceName = rs.getString("servicio_nombre");
            String reason = rs.getString("motivo_consulta");
            String notes = rs.getString("notas");
            PendingCaseDTO caseData = new PendingCaseDTO(
                    serviceId != null ? serviceId.toString() : null,
                    serviceName != null ? serviceName : "",
                    reason != null ? reason : "",
                    notes != null ? notes : "",
                    rs.getDouble("precio_reservado")
            );

            // Location
            UUID locationId = (UUID) rs.getObject("lugar_id");
            UUID clinicId = (UUID) rs.getObject("clinica_id");
            String clinicName = rs.getString("clinica_nombre");
            PendingLocationDTO location = new PendingLocationDTO(
                    locationId != null ? locationId.toString() : "",
                    rs.getString("lugar_nombre"),
                    rs.getString("lugar_tipo"),
                    rs.getString("lugar_direccion"),
                    rs.getString("lugar_ciudad"),
                    clinicId != null ? clinicId.toString() : null,
                    clinicName != null ? clinicName : ""
            );

            return new PendingAppointmentDTO(
                    appointmentId != null ? appointmentId.toString() : "",
                    dateVal != null ? dateVal.toString() : "",
                    startTimeVal != null ? formatTime(startTimeVal.toLocalTime()) : "",
                    endTimeVal != null ? formatTime(endTimeVal.toLocalTime()) : "",
                    translateStatus(rs.getString("estado")),
                    patient,
                    caseData,
                    location
            );
        });
    }

    public AppointmentRecord getAppointment(UUID appointmentId) {
        String sql = "SELECT id, doctor_id, fecha, hora_inicio, CAST(estado AS TEXT) AS estado FROM cita WHERE id = :appointmentId";
        MapSqlParameterSource params = new MapSqlParameterSource("appointmentId", appointmentId);
        try {
            return jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> {
                AppointmentRecord r = new AppointmentRecord();
                r.id = (UUID) rs.getObject("id");
                r.doctorId = (UUID) rs.getObject("doctor_id");
                r.fecha = rs.getDate("fecha").toLocalDate();
                r.horaInicio = rs.getTime("hora_inicio").toLocalTime();
                r.estado = rs.getString("estado");
                return r;
            });
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void updateAppointmentStatus(UUID appointmentId, UUID doctorId, String newStatus, String notes, LocalDateTime updatedAt) {
        String sql = "UPDATE cita SET " +
                "estado = CAST(:newStatus AS estado_cita), " +
                "notas = COALESCE(:notes, notas), " +
                "actualizado_en = :updatedAt " +
                "WHERE id = :appointmentId AND doctor_id = :doctorId";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("appointmentId", appointmentId)
                .addValue("doctorId", doctorId)
                .addValue("newStatus", newStatus)
                .addValue("notes", notes)
                .addValue("updatedAt", Timestamp.valueOf(updatedAt));

        jdbcTemplate.update(sql, params);
    }

    private String formatTime(LocalTime time) {
        if (time == null) return "";
        String hour = String.format("%02d", time.getHour());
        String min = String.format("%02d", time.getMinute());
        return hour + ":" + min;
    }

    private String translateStatus(String dbStatus) {
        if (dbStatus == null) return "Pendiente";
        String lower = dbStatus.trim().toLowerCase();
        switch (lower) {
            case "pendiente":
                return "Pendiente";
            case "confirmada":
                return "Confirmada";
            case "cancelada":
                return "Cancelada";
            case "completada":
                return "Completada";
            case "bloqueada":
                return "Bloqueada";
            case "rechazada":
                return "Rechazada";
            default:
                return "Pendiente";
        }
    }

    public static class AppointmentRecord {
        public UUID id;
        public UUID doctorId;
        public LocalDate fecha;
        public LocalTime horaInicio;
        public String estado;
    }
}
