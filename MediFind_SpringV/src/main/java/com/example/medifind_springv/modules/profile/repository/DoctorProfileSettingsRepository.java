package com.example.medifind_springv.modules.profile.repository;

import com.example.medifind_springv.modules.profile.dto.*;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public class DoctorProfileSettingsRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public DoctorProfileSettingsRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean doctorExists(UUID doctorId) {
        String sql = "SELECT COUNT(*) FROM doctor WHERE id = :doctorId";
        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public String getDoctorPhotoUrl(UUID doctorId) {
        String sql = "SELECT foto_url FROM doctor WHERE id = :doctorId";
        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);
        try {
            String val = jdbcTemplate.queryForObject(sql, params, String.class);
            return val != null ? val : "";
        } catch (EmptyResultDataAccessException e) {
            return "";
        }
    }

    public boolean specialtyExists(UUID specialtyId) {
        String sql = "SELECT COUNT(*) FROM especialidad WHERE id = :specialtyId";
        MapSqlParameterSource params = new MapSqlParameterSource("specialtyId", specialtyId);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public ProfessionalIdentityDTO getProfessionalIdentity(UUID doctorId) {
        String sql = "SELECT " +
                "d.nombre_profesional, " +
                "d.headline, " +
                "d.biografia, " +
                "d.anios_experiencia, " +
                "es.id AS specialty_id, " +
                "es.nombre AS specialty_name " +
                "FROM doctor d " +
                "LEFT JOIN doctor_especialidad de ON d.id = de.doctor_id " +
                "LEFT JOIN especialidad es ON de.especialidad_id = es.id " +
                "WHERE d.id = :doctorId " +
                "ORDER BY es.nombre ASC " +
                "LIMIT 1";

        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);

        try {
            return jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> {
                UUID specIdUUID = (UUID) rs.getObject("specialty_id");
                return new ProfessionalIdentityDTO(
                        rs.getString("nombre_profesional"),
                        specIdUUID != null ? specIdUUID.toString() : null,
                        rs.getString("specialty_name"),
                        rs.getString("headline"),
                        rs.getString("biografia"),
                        (Integer) rs.getObject("anios_experiencia")
                );
            });
        } catch (EmptyResultDataAccessException e) {
            return new ProfessionalIdentityDTO("", null, "", "", "", 0);
        }
    }

    public ContactVisibilityDTO getContactVisibility(UUID doctorId) {
        String sql = "SELECT " +
                "telefono_publico, " +
                "email_publico, " +
                "ciudad, " +
                "resumen_ubicacion, " +
                "perfil_visible, " +
                "consulta_en_linea " +
                "FROM doctor " +
                "WHERE id = :doctorId";

        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);

        try {
            return jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> new ContactVisibilityDTO(
                    rs.getString("telefono_publico"),
                    rs.getString("email_publico"),
                    rs.getString("ciudad"),
                    rs.getString("resumen_ubicacion"),
                    rs.getBoolean("perfil_visible"),
                    rs.getBoolean("consulta_en_linea")
            ));
        } catch (EmptyResultDataAccessException e) {
            return new ContactVisibilityDTO("", "", "", "", false, false);
        }
    }

    public List<EducationDTO> getEducation(UUID doctorId) {
        String sql = "SELECT " +
                "id, " +
                "titulo, " +
                "institucion, " +
                "anio_inicio, " +
                "anio_fin, " +
                "descripcion " +
                "FROM educacion_doctor " +
                "WHERE doctor_id = :doctorId " +
                "ORDER BY anio_inicio DESC";

        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> {
            UUID idUUID = (UUID) rs.getObject("id");
            return new EducationDTO(
                    idUUID != null ? idUUID.toString() : "",
                    rs.getString("titulo"),
                    rs.getString("institucion"),
                    (Integer) rs.getObject("anio_inicio"),
                    (Integer) rs.getObject("anio_fin"),
                    rs.getString("descripcion")
            );
        });
    }

    public List<ExperienceDTO> getExperience(UUID doctorId) {
        String sql = "SELECT " +
                "id, " +
                "cargo, " +
                "institucion, " +
                "anio_inicio, " +
                "anio_fin, " +
                "descripcion " +
                "FROM experiencia_doctor " +
                "WHERE doctor_id = :doctorId " +
                "ORDER BY anio_inicio DESC";

        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);

        return jdbcTemplate.query(sql, params, (rs, rowNum) -> {
            UUID idUUID = (UUID) rs.getObject("id");
            return new ExperienceDTO(
                    idUUID != null ? idUUID.toString() : "",
                    rs.getString("cargo"),
                    rs.getString("institucion"),
                    (Integer) rs.getObject("anio_inicio"),
                    (Integer) rs.getObject("anio_fin"),
                    rs.getString("descripcion")
            );
        });
    }

    public void updateProfessionalIdentity(UUID doctorId, String publicName, String headline, String bio, Integer yearsOfExperience, LocalDateTime updatedAt) {
        String sql = "UPDATE doctor SET " +
                "nombre_profesional = :publicName, " +
                "headline = :headline, " +
                "biografia = :bio, " +
                "anios_experiencia = :yearsOfExperience, " +
                "actualizado_en = :updatedAt " +
                "WHERE id = :doctorId";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("doctorId", doctorId)
                .addValue("publicName", publicName)
                .addValue("headline", headline)
                .addValue("bio", bio)
                .addValue("yearsOfExperience", yearsOfExperience)
                .addValue("updatedAt", Timestamp.valueOf(updatedAt));

        jdbcTemplate.update(sql, params);
    }

    public void deleteDoctorSpecialties(UUID doctorId) {
        String sql = "DELETE FROM doctor_especialidad WHERE doctor_id = :doctorId";
        MapSqlParameterSource params = new MapSqlParameterSource("doctorId", doctorId);
        jdbcTemplate.update(sql, params);
    }

    public void insertDoctorSpecialty(UUID id, UUID doctorId, UUID specialtyId) {
        String sql = "INSERT INTO doctor_especialidad (id, doctor_id, especialidad_id) " +
                "VALUES (:id, :doctorId, :specialtyId)";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("doctorId", doctorId)
                .addValue("specialtyId", specialtyId);

        jdbcTemplate.update(sql, params);
    }

    public void updateContactVisibility(UUID doctorId, String publicPhone, String publicEmail, String city, String locationSummary, boolean profileVisible, boolean onlineConsultationAvailable, LocalDateTime updatedAt) {
        String sql = "UPDATE doctor SET " +
                "telefono_publico = :publicPhone, " +
                "email_publico = :publicEmail, " +
                "ciudad = :city, " +
                "resumen_ubicacion = :locationSummary, " +
                "perfil_visible = :profileVisible, " +
                "consulta_en_linea = :onlineConsultationAvailable, " +
                "actualizado_en = :updatedAt " +
                "WHERE id = :doctorId";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("doctorId", doctorId)
                .addValue("publicPhone", publicPhone)
                .addValue("publicEmail", publicEmail)
                .addValue("city", city)
                .addValue("locationSummary", locationSummary)
                .addValue("profileVisible", profileVisible)
                .addValue("onlineConsultationAvailable", onlineConsultationAvailable)
                .addValue("updatedAt", Timestamp.valueOf(updatedAt));

        jdbcTemplate.update(sql, params);
    }

    // Education CRUD

    public static class DbEducation {
        public UUID id;
        public UUID doctorId;
        public String title;
        public String institution;
        public Integer startYear;
        public Integer endYear;
        public String description;
    }

    public DbEducation findEducationById(UUID educationId) {
        String sql = "SELECT id, doctor_id, titulo, institucion, anio_inicio, anio_fin, descripcion FROM educacion_doctor WHERE id = :educationId";
        MapSqlParameterSource params = new MapSqlParameterSource("educationId", educationId);
        try {
            return jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> {
                DbEducation e = new DbEducation();
                e.id = (UUID) rs.getObject("id");
                e.doctorId = (UUID) rs.getObject("doctor_id");
                e.title = rs.getString("titulo");
                e.institution = rs.getString("institucion");
                e.startYear = (Integer) rs.getObject("anio_inicio");
                e.endYear = (Integer) rs.getObject("anio_fin");
                e.description = rs.getString("descripcion");
                return e;
            });
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void insertEducation(UUID id, UUID doctorId, String title, String institution, Integer startYear, Integer endYear, String description) {
        String sql = "INSERT INTO educacion_doctor (id, doctor_id, titulo, institucion, anio_inicio, anio_fin, descripcion) " +
                "VALUES (:id, :doctorId, :title, :institution, :startYear, :endYear, :description)";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("doctorId", doctorId)
                .addValue("title", title)
                .addValue("institution", institution)
                .addValue("startYear", startYear)
                .addValue("endYear", endYear)
                .addValue("description", description);

        jdbcTemplate.update(sql, params);
    }

    public void updateEducation(UUID educationId, String title, String institution, Integer startYear, Integer endYear, String description) {
        String sql = "UPDATE educacion_doctor SET " +
                "titulo = :title, " +
                "institucion = :institution, " +
                "anio_inicio = :startYear, " +
                "anio_fin = :endYear, " +
                "descripcion = :description " +
                "WHERE id = :educationId";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("educationId", educationId)
                .addValue("title", title)
                .addValue("institution", institution)
                .addValue("startYear", startYear)
                .addValue("endYear", endYear)
                .addValue("description", description);

        jdbcTemplate.update(sql, params);
    }

    public void deleteEducation(UUID educationId) {
        String sql = "DELETE FROM educacion_doctor WHERE id = :educationId";
        MapSqlParameterSource params = new MapSqlParameterSource("educationId", educationId);
        jdbcTemplate.update(sql, params);
    }

    // Experience CRUD

    public static class DbExperience {
        public UUID id;
        public UUID doctorId;
        public String position;
        public String institution;
        public Integer startYear;
        public Integer endYear;
        public String description;
    }

    public DbExperience findExperienceById(UUID experienceId) {
        String sql = "SELECT id, doctor_id, cargo, institucion, anio_inicio, anio_fin, descripcion FROM experiencia_doctor WHERE id = :experienceId";
        MapSqlParameterSource params = new MapSqlParameterSource("experienceId", experienceId);
        try {
            return jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> {
                DbExperience exp = new DbExperience();
                exp.id = (UUID) rs.getObject("id");
                exp.doctorId = (UUID) rs.getObject("doctor_id");
                exp.position = rs.getString("cargo");
                exp.institution = rs.getString("institucion");
                exp.startYear = (Integer) rs.getObject("anio_inicio");
                exp.endYear = (Integer) rs.getObject("anio_fin");
                exp.description = rs.getString("descripcion");
                return exp;
            });
        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public void insertExperience(UUID id, UUID doctorId, String position, String institution, Integer startYear, Integer endYear, String description) {
        String sql = "INSERT INTO experiencia_doctor (id, doctor_id, cargo, institucion, anio_inicio, anio_fin, descripcion) " +
                "VALUES (:id, :doctorId, :position, :institution, :startYear, :endYear, :description)";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("doctorId", doctorId)
                .addValue("position", position)
                .addValue("institution", institution)
                .addValue("startYear", startYear)
                .addValue("endYear", endYear)
                .addValue("description", description);

        jdbcTemplate.update(sql, params);
    }

    public void updateExperience(UUID experienceId, String position, String institution, Integer startYear, Integer endYear, String description) {
        String sql = "UPDATE experiencia_doctor SET " +
                "cargo = :position, " +
                "institucion = :institution, " +
                "anio_inicio = :startYear, " +
                "anio_fin = :endYear, " +
                "descripcion = :description " +
                "WHERE id = :experienceId";

        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("experienceId", experienceId)
                .addValue("position", position)
                .addValue("institution", institution)
                .addValue("startYear", startYear)
                .addValue("endYear", endYear)
                .addValue("description", description);

        jdbcTemplate.update(sql, params);
    }

    public void deleteExperience(UUID experienceId) {
        String sql = "DELETE FROM experiencia_doctor WHERE id = :experienceId";
        MapSqlParameterSource params = new MapSqlParameterSource("experienceId", experienceId);
        jdbcTemplate.update(sql, params);
    }
}
