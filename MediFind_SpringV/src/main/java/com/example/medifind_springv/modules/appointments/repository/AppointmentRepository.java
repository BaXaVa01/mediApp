package com.example.medifind_springv.modules.appointments.repository;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Time;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Repository
public class AppointmentRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public AppointmentRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean doctorExists(UUID doctorId) {
        String sql = "SELECT COUNT(*) FROM doctor WHERE id = :id";
        MapSqlParameterSource params = new MapSqlParameterSource("id", doctorId);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public boolean patientExists(UUID patientId) {
        String sql = "SELECT COUNT(*) FROM paciente WHERE id = :id";
        MapSqlParameterSource params = new MapSqlParameterSource("id", patientId);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public ServiceEntity getActiveService(UUID serviceId) {
        String sql = "SELECT id, doctor_id, clinica_id, lugar_atencion_id, nombre, precio, duracion_minutos " +
                "FROM servicio WHERE id = :id AND activo = true";
        MapSqlParameterSource params = new MapSqlParameterSource("id", serviceId);
        try {
            return jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> {
                ServiceEntity s = new ServiceEntity();
                s.id = (UUID) rs.getObject("id");
                s.doctorId = (UUID) rs.getObject("doctor_id");
                s.clinicaId = (UUID) rs.getObject("clinica_id");
                s.lugarAtencionId = (UUID) rs.getObject("lugar_atencion_id");
                s.nombre = rs.getString("nombre");
                s.precio = rs.getDouble("precio");
                s.duracionMinutos = rs.getInt("duracion_minutos");
                return s;
            });
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public LocationEntity getActiveLocation(UUID locationId) {
        String sql = "SELECT id, doctor_id, clinica_id, nombre, direccion, ciudad, es_principal " +
                "FROM lugar_atencion WHERE id = :id AND activo = true";
        MapSqlParameterSource params = new MapSqlParameterSource("id", locationId);
        try {
            return jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> {
                LocationEntity l = new LocationEntity();
                l.id = (UUID) rs.getObject("id");
                l.doctorId = (UUID) rs.getObject("doctor_id");
                l.clinicaId = (UUID) rs.getObject("clinica_id");
                l.nombre = rs.getString("nombre");
                l.direccion = rs.getString("direccion");
                l.ciudad = rs.getString("ciudad");
                l.esPrincipal = rs.getBoolean("es_principal");
                return l;
            });
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public boolean isDoctorActiveAtClinic(UUID doctorId, UUID clinicaId) {
        String sql = "SELECT COUNT(*) FROM doctor_clinica WHERE doctor_id = :doctorId AND clinica_id = :clinicaId AND activo = true";
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("doctorId", doctorId)
                .addValue("clinicaId", clinicaId);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public List<ScheduleEntity> getActiveSchedules(UUID doctorId, UUID locationId, int dayOfWeek) {
        String sql = "SELECT id, dia_semana, hora_inicio, hora_fin, duracion_cita_minutos, lugar_atencion_id " +
                "FROM horario_atencion " +
                "WHERE doctor_id = :doctorId AND activo = true AND dia_semana = :dayOfWeek";
        
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("doctorId", doctorId)
                .addValue("dayOfWeek", dayOfWeek);

        if (locationId != null) {
            sql += " AND lugar_atencion_id = :locationId";
            params.addValue("locationId", locationId);
        }

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> {
            ScheduleEntity s = new ScheduleEntity();
            s.id = (UUID) rs.getObject("id");
            s.diaSemana = rs.getInt("dia_semana");
            s.horaInicio = rs.getTime("hora_inicio").toLocalTime();
            s.horaFin = rs.getTime("hora_fin").toLocalTime();
            s.duracionCitaMinutos = rs.getInt("duracion_cita_minutos");
            s.lugarAtencionId = (UUID) rs.getObject("lugar_atencion_id");
            return s;
        });
    }

    public List<TimeRange> getExistingAppointments(UUID doctorId, LocalDate date) {
        String sql = "SELECT hora_inicio, hora_fin FROM cita " +
                "WHERE doctor_id = :doctorId AND fecha = :date AND estado <> CAST('cancelada' AS estado_cita)";
        
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("doctorId", doctorId)
                .addValue("date", Date.valueOf(date));

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> new TimeRange(
                rs.getTime("hora_inicio").toLocalTime(),
                rs.getTime("hora_fin").toLocalTime()
        ));
    }

    public List<BlockEntity> getDisponibilidadBloqueos(UUID doctorId, LocalDate date, UUID locationId) {
        String sql = "SELECT hora_inicio, hora_fin, lugar_atencion_id FROM disponibilidad_bloqueo " +
                "WHERE doctor_id = :doctorId AND fecha = :date";
        
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("doctorId", doctorId)
                .addValue("date", Date.valueOf(date));

        if (locationId != null) {
            sql += " AND (lugar_atencion_id IS NULL OR lugar_atencion_id = :locationId)";
            params.addValue("locationId", locationId);
        }

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> {
            BlockEntity b = new BlockEntity();
            b.horaInicio = rs.getTime("hora_inicio").toLocalTime();
            b.horaFin = rs.getTime("hora_fin").toLocalTime();
            b.lugarAtencionId = (UUID) rs.getObject("lugar_atencion_id");
            return b;
        });
    }

    public void insertCita(UUID id, UUID doctorId, UUID pacienteId, LocalDate date, LocalTime startTime, LocalTime endTime,
                           UUID serviceId, UUID locationId, UUID clinicId, Double reservedPrice, String reason, String notes, String status, LocalDateTime createdUpdated) {
        
        String sql = "INSERT INTO cita (id, doctor_id, paciente_id, fecha, hora_inicio, hora_fin, servicio_id, lugar_atencion_id, clinica_id, precio_reservado, motivo_consulta, notas, estado, creado_en, actualizado_en) " +
                "VALUES (:id, :doctorId, :pacienteId, :date, :startTime, :endTime, :serviceId, :locationId, :clinicId, :reservedPrice, :reason, :notes, CAST(:status AS estado_cita), :creadoEn, :actualizadoEn)";
        
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("doctorId", doctorId)
                .addValue("pacienteId", pacienteId)
                .addValue("date", Date.valueOf(date))
                .addValue("startTime", Time.valueOf(startTime))
                .addValue("endTime", Time.valueOf(endTime))
                .addValue("serviceId", serviceId)
                .addValue("locationId", locationId)
                .addValue("clinicId", clinicId)
                .addValue("reservedPrice", reservedPrice != null ? BigDecimal.valueOf(reservedPrice) : null)
                .addValue("reason", reason)
                .addValue("notes", notes)
                .addValue("status", status)
                .addValue("creadoEn", Timestamp.valueOf(createdUpdated))
                .addValue("actualizadoEn", Timestamp.valueOf(createdUpdated));

        jdbcTemplate.update(sql, params);
    }

    // Entity templates used strictly inside the repository/service layer
    public static class ServiceEntity {
        public UUID id;
        public UUID doctorId;
        public UUID clinicaId;
        public UUID lugarAtencionId;
        public String nombre;
        public Double precio;
        public int duracionMinutos;
    }

    public static class LocationEntity {
        public UUID id;
        public UUID doctorId;
        public UUID clinicaId;
        public String nombre;
        public String direccion;
        public String ciudad;
        public boolean esPrincipal;
    }

    public static class ScheduleEntity {
        public UUID id;
        public int diaSemana;
        public LocalTime horaInicio;
        public LocalTime horaFin;
        public int duracionCitaMinutos;
        public UUID lugarAtencionId;
    }

    public static class BlockEntity {
        public LocalTime horaInicio;
        public LocalTime horaFin;
        public UUID lugarAtencionId;
    }

    public static class TimeRange {
        public LocalTime startTime;
        public LocalTime endTime;

        public TimeRange(LocalTime startTime, LocalTime endTime) {
            this.startTime = startTime;
            this.endTime = endTime;
        }
    }
}
