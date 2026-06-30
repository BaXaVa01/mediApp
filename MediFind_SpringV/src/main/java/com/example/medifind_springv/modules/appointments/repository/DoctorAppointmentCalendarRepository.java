package com.example.medifind_springv.modules.appointments.repository;

import com.example.medifind_springv.modules.appointments.dto.CalendarCaseDTO;
import com.example.medifind_springv.modules.appointments.dto.CalendarLocationDTO;
import com.example.medifind_springv.modules.appointments.dto.CalendarPatientDTO;
import com.example.medifind_springv.modules.appointments.dto.DoctorCalendarAppointmentDTO;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public class DoctorAppointmentCalendarRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public DoctorAppointmentCalendarRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean doctorExists(UUID doctorId) {
        String sql = "SELECT COUNT(*) FROM doctor WHERE id = :doctorId";
        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public List<DoctorCalendarAppointmentDTO> getWeeklyAppointments(UUID doctorId, LocalDate weekStart, LocalDate weekEnd) {
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
                "p.fecha_nacimiento, " +
                "CAST(p.genero AS TEXT) AS genero, " +
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
                "AND c.fecha BETWEEN :weekStart AND :weekEnd " +
                "ORDER BY c.fecha ASC, c.hora_inicio ASC";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("doctorId", doctorId)
                .addValue("weekStart", Date.valueOf(weekStart))
                .addValue("weekEnd", Date.valueOf(weekEnd));

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> {
            UUID appointmentId = (UUID) rs.getObject("appointment_id");
            Date dateVal = rs.getDate("fecha");
            Time startTimeVal = rs.getTime("hora_inicio");
            Time endTimeVal = rs.getTime("hora_fin");
            
            // Map Patient
            UUID patientId = (UUID) rs.getObject("paciente_id");
            Date birthDateVal = rs.getDate("fecha_nacimiento");
            String phone = rs.getString("paciente_telefono");
            String gender = rs.getString("genero");
            CalendarPatientDTO patient = new CalendarPatientDTO(
                    patientId != null ? patientId.toString() : "",
                    rs.getString("paciente_nombre"),
                    rs.getString("paciente_email"),
                    phone != null ? phone : "",
                    gender != null ? gender.toUpperCase() : "",
                    birthDateVal != null ? birthDateVal.toString() : ""
            );

            // Map Case/Service
            UUID serviceId = (UUID) rs.getObject("servicio_id");
            String serviceName = rs.getString("servicio_nombre");
            String reason = rs.getString("motivo_consulta");
            String notes = rs.getString("notas");
            CalendarCaseDTO caseData = new CalendarCaseDTO(
                    serviceId != null ? serviceId.toString() : null,
                    serviceName != null ? serviceName : "",
                    reason != null ? reason : "",
                    notes != null ? notes : "",
                    rs.getDouble("precio_reservado")
            );

            // Map Location
            UUID locationId = (UUID) rs.getObject("lugar_id");
            UUID clinicId = (UUID) rs.getObject("clinica_id");
            String clinicName = rs.getString("clinica_nombre");
            CalendarLocationDTO location = new CalendarLocationDTO(
                    locationId != null ? locationId.toString() : "",
                    rs.getString("lugar_nombre"),
                    rs.getString("lugar_tipo"),
                    rs.getString("lugar_direccion"),
                    rs.getString("lugar_ciudad"),
                    clinicId != null ? clinicId.toString() : null,
                    clinicName != null ? clinicName : ""
            );

            return new DoctorCalendarAppointmentDTO(
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
}
