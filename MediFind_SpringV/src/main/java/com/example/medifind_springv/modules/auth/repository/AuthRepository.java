package com.example.medifind_springv.modules.auth.repository;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public class AuthRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;

    public AuthRepository(NamedParameterJdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public boolean existsByEmail(String email) {
        String sql = "SELECT COUNT(*) FROM usuario WHERE LOWER(email) = LOWER(:email)";
        MapSqlParameterSource params = new MapSqlParameterSource("email", email);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count > 0;
    }

    public boolean allSpecialtiesExist(List<UUID> specialtyIds) {
        if (specialtyIds == null || specialtyIds.isEmpty()) {
            return true;
        }
        String sql = "SELECT COUNT(*) FROM especialidad WHERE id IN (:ids)";
        MapSqlParameterSource params = new MapSqlParameterSource("ids", specialtyIds);
        Integer count = jdbcTemplate.queryForObject(sql, params, Integer.class);
        return count != null && count == specialtyIds.size();
    }

    public void insertUsuario(UUID id, String name, String email, String passwordHash, String phone, String role, String status, LocalDateTime createdUpdated) {
        String sql = "INSERT INTO usuario (id, nombre, email, password_hash, telefono, rol, estado, creado_en, actualizado_en) " +
                "VALUES (:id, :name, :email, :passwordHash, :phone, CAST(:role AS rol_usuario), CAST(:status AS estado_usuario), :creadoEn, :actualizadoEn)";
        
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("name", name)
                .addValue("email", email)
                .addValue("passwordHash", passwordHash)
                .addValue("phone", phone)
                .addValue("role", role)
                .addValue("status", status)
                .addValue("creadoEn", Timestamp.valueOf(createdUpdated))
                .addValue("actualizadoEn", Timestamp.valueOf(createdUpdated));

        jdbcTemplate.update(sql, params);
    }

    private static class Timestamp {
        static java.sql.Timestamp valueOf(LocalDateTime ldt) {
            return ldt != null ? java.sql.Timestamp.valueOf(ldt) : null;
        }
    }

    public void insertPaciente(UUID id, UUID usuarioId, String address, LocalDate birthDate, String gender) {
        String sql = "INSERT INTO paciente (id, usuario_id, direccion, fecha_nacimiento, genero) " +
                "VALUES (:id, :usuarioId, :address, :birthDate, CAST(:gender AS genero_paciente))";
        
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("usuarioId", usuarioId)
                .addValue("address", address)
                .addValue("birthDate", birthDate != null ? java.sql.Date.valueOf(birthDate) : null)
                .addValue("gender", gender);

        jdbcTemplate.update(sql, params);
    }

    public void insertDoctor(UUID id, UUID usuarioId, String professionalName, String licenseNumber, String bio, String photoUrl, boolean verificado, LocalDateTime creadoEn) {
        String sql = "INSERT INTO doctor (id, usuario_id, nombre_profesional, numero_licencia, biografia, foto_url, verificado, creado_en) " +
                "VALUES (:id, :usuarioId, :professionalName, :licenseNumber, :bio, :photoUrl, :verificado, :creadoEn)";
        
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("usuarioId", usuarioId)
                .addValue("professionalName", professionalName)
                .addValue("licenseNumber", licenseNumber)
                .addValue("bio", bio)
                .addValue("photoUrl", photoUrl)
                .addValue("verificado", verificado)
                .addValue("creadoEn", Timestamp.valueOf(creadoEn));

        jdbcTemplate.update(sql, params);
    }

    public void insertDoctorEspecialidad(UUID id, UUID doctorId, UUID specialtyId) {
        String sql = "INSERT INTO doctor_especialidad (id, doctor_id, especialidad_id) " +
                "VALUES (:id, :doctorId, :specialtyId)";
        
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("id", id)
                .addValue("doctorId", doctorId)
                .addValue("specialtyId", specialtyId);

        jdbcTemplate.update(sql, params);
    }

    public void insertDoctorPerfilExtra(UUID doctorId, String seguros, String tiposConsulta, String enfermedadesTratadas, String tiposPaciente, String certificaciones, String idiomas, String publicaciones, String premios) {
        String sql = "INSERT INTO doctor_perfil_extra (doctor_id, seguros, tipos_consulta, enfermedades_tratadas, tipos_paciente, certificaciones, idiomas, publicaciones, premios) " +
                "VALUES (:doctorId, :seguros, :tiposConsulta, :enfermedadesTratadas, :tiposPaciente, :certificaciones, :idiomas, :publicaciones, :premios)";
        
        MapSqlParameterSource params = new MapSqlParameterSource()
                .addValue("doctorId", doctorId)
                .addValue("seguros", seguros)
                .addValue("tiposConsulta", tiposConsulta)
                .addValue("enfermedadesTratadas", enfermedadesTratadas)
                .addValue("tiposPaciente", tiposPaciente)
                .addValue("certificaciones", certificationsHelper(certificaciones))
                .addValue("idiomas", idiomas)
                .addValue("publicaciones", publicaciones)
                .addValue("premios", premios);

        jdbcTemplate.update(sql, params);
    }

    // A small helper to prevent parameter issues
    private String certificationsHelper(String certs) {
        return certs;
    }

    public static class UserRecord {
        public UUID id;
        public String nombre;
        public String email;
        public String telefono;
        public String passwordHash;
        public String rol;
        public String estado;
    }

    public static class DoctorRecord {
        public UUID id;
        public String nombreProfesional;
    }

    public UserRecord findUserByEmail(String email) {
        String sql = "SELECT id, nombre, email, telefono, password_hash, CAST(rol AS TEXT) AS rol, CAST(estado AS TEXT) AS estado " +
                "FROM usuario WHERE LOWER(email) = LOWER(:email) LIMIT 1";
        MapSqlParameterSource params = new MapSqlParameterSource("email", email);
        try {
            return jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> {
                UserRecord u = new UserRecord();
                u.id = (UUID) rs.getObject("id");
                u.nombre = rs.getString("nombre");
                u.email = rs.getString("email");
                u.telefono = rs.getString("telefono");
                u.passwordHash = rs.getString("password_hash");
                u.rol = rs.getString("rol");
                u.estado = rs.getString("estado");
                return u;
            });
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null;
        }
    }

    public DoctorRecord findDoctorByUserId(UUID userId) {
        String sql = "SELECT id, nombre_profesional FROM doctor WHERE usuario_id = :userId LIMIT 1";
        MapSqlParameterSource params = new MapSqlParameterSource("userId", userId);
        try {
            return jdbcTemplate.queryForObject(sql, params, (rs, rowNum) -> {
                DoctorRecord d = new DoctorRecord();
                d.id = (UUID) rs.getObject("id");
                d.nombreProfesional = rs.getString("nombre_profesional");
                return d;
            });
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null;
        }
    }

    public UUID findPatientByUserId(UUID userId) {
        String sql = "SELECT id FROM paciente WHERE usuario_id = :userId LIMIT 1";
        MapSqlParameterSource params = new MapSqlParameterSource("userId", userId);
        try {
            return jdbcTemplate.queryForObject(sql, params, UUID.class);
        } catch (org.springframework.dao.EmptyResultDataAccessException e) {
            return null;
        }
    }
}
