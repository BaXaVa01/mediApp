package com.example.medifind_springv.modules.auth.service;

import com.example.medifind_springv.config.JwtService;
import com.example.medifind_springv.modules.auth.dto.RegisterUserRequest;
import com.example.medifind_springv.modules.auth.dto.RegisterUserResponse;
import com.example.medifind_springv.modules.auth.exception.EmailAlreadyExistsException;
import com.example.medifind_springv.modules.auth.exception.InvalidRegisterRequestException;
import com.example.medifind_springv.modules.auth.repository.AuthRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class AuthService {

    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;
    private final ObjectMapper objectMapper;
    private final JwtService jwtService;

    public AuthService(AuthRepository authRepository, PasswordEncoder passwordEncoder, ObjectMapper objectMapper, JwtService jwtService) {
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
        this.objectMapper = objectMapper;
        this.jwtService = jwtService;
    }

    @Transactional
    public RegisterUserResponse registerUser(RegisterUserRequest request) {
        // 1. Check if email already exists
        if (authRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Ya existe un usuario registrado con este correo.");
        }

        // 2. Hash password
        String passwordHash = passwordEncoder.encode(request.getPassword());

        // 3. Generate User UUID
        UUID userId = UUID.randomUUID();
        LocalDateTime now = LocalDateTime.now();

        if ("PATIENT".equalsIgnoreCase(request.getAccountType())) {
            // Register Patient
            String dbRole = "paciente";
            String dbStatus = "activo";

            // Insert into usuario
            authRepository.insertUsuario(userId, request.getName(), request.getEmail(), passwordHash, request.getPhone(), dbRole, dbStatus, now);

            // Generate Patient Profile UUID
            UUID profileId = UUID.randomUUID();

            LocalDate birthDate = null;
            if (request.getBirthDate() != null && !request.getBirthDate().trim().isEmpty()) {
                try {
                    birthDate = LocalDate.parse(request.getBirthDate().trim());
                } catch (Exception e) {
                    throw new InvalidRegisterRequestException("El formato de fecha de nacimiento es inválido. Use YYYY-MM-DD.", "INVALID_BIRTHDATE");
                }
            }

            String dbGender = null;
            if (request.getGender() != null && !request.getGender().trim().isEmpty()) {
                dbGender = mapGender(request.getGender());
            }

            // Insert into paciente
            authRepository.insertPaciente(profileId, userId, request.getAddress(), birthDate, dbGender);

            return new RegisterUserResponse(
                    userId.toString(),
                    profileId.toString(),
                    "PATIENT",
                    request.getName(),
                    request.getEmail(),
                    "PACIENTE",
                    "Usuario registrado correctamente"
            );

        } else if ("DOCTOR".equalsIgnoreCase(request.getAccountType())) {
            // Validate specialties existence first
            List<UUID> specialtyUUIDs = new ArrayList<>();
            if (request.getSpecialtyIds() != null) {
                for (String specIdStr : request.getSpecialtyIds()) {
                    try {
                        specialtyUUIDs.add(UUID.fromString(specIdStr));
                    } catch (IllegalArgumentException e) {
                        throw new InvalidRegisterRequestException("Una o más especialidades no existen.", "INVALID_SPECIALTY");
                    }
                }
            }

            if (!authRepository.allSpecialtiesExist(specialtyUUIDs)) {
                throw new InvalidRegisterRequestException("Una o más especialidades no existen.", "INVALID_SPECIALTY");
            }

            // Register Doctor
            String dbRole = "doctor";
            String dbStatus = "activo";

            // Insert into usuario
            authRepository.insertUsuario(userId, request.getName(), request.getEmail(), passwordHash, request.getPhone(), dbRole, dbStatus, now);

            // Generate Doctor Profile UUID
            UUID profileId = UUID.randomUUID();

            // Insert into doctor
            authRepository.insertDoctor(
                    profileId,
                    userId,
                    request.getProfessionalName(),
                    request.getLicenseNumber(),
                    request.getBio(),
                    request.getPhotoUrl(),
                    false,
                    now
            );

            // Insert doctor_especialidad relationships
            for (UUID specId : specialtyUUIDs) {
                authRepository.insertDoctorEspecialidad(UUID.randomUUID(), profileId, specId);
            }

            // Insert doctor_perfil_extra
            String seguros = "[]";
            String tiposConsulta = "[]";
            String enfermedadesTratadas = "[]";
            String tiposPaciente = "[]";
            String certificaciones = "[]";
            String idiomas = "[]";
            String publicaciones = "[]";
            String premios = "[]";

            RegisterUserRequest.ExtraProfile ep = request.getExtraProfile();
            if (ep != null) {
                seguros = writeJsonString(ep.getInsurance());
                tiposConsulta = writeJsonString(ep.getConsultationTypes());
                enfermedadesTratadas = writeJsonString(ep.getDiseasesTreated());
                tiposPaciente = writeJsonString(ep.getPatientTypes());
                certificaciones = writeJsonString(ep.getCertifications());
                idiomas = writeJsonString(ep.getLanguages());
                publicaciones = writeJsonString(ep.getPublications());
                premios = writeJsonString(ep.getAwards());
            }

            authRepository.insertDoctorPerfilExtra(
                    profileId,
                    seguros,
                    tiposConsulta,
                    enfermedadesTratadas,
                    tiposPaciente,
                    certificaciones,
                    idiomas,
                    publicaciones,
                    premios
            );

            return new RegisterUserResponse(
                    userId.toString(),
                    profileId.toString(),
                    "DOCTOR",
                    request.getName(),
                    request.getEmail(),
                    "DOCTOR",
                    "Usuario registrado correctamente"
            );

        } else {
            throw new InvalidRegisterRequestException("El tipo de cuenta debe ser PATIENT o DOCTOR.", "INVALID_ACCOUNT_TYPE");
        }
    }

    private String mapGender(String requestGender) {
        if (requestGender == null) return null;
        String lower = requestGender.trim().toLowerCase();
        switch (lower) {
            case "masculino":
                return "masculino";
            case "femenino":
                return "femenino";
            case "otro":
                return "otro";
            case "no_especificado":
            case "no especificado":
                return "no_especificado";
            default:
                return "no_especificado";
        }
    }

    private String writeJsonString(List<String> list) {
        if (list == null) {
            return "[]";
        }
        try {
            return objectMapper.writeValueAsString(list);
        } catch (Exception e) {
            return "[]";
        }
    }

    public com.example.medifind_springv.modules.auth.dto.LoginResponse login(com.example.medifind_springv.modules.auth.dto.LoginRequest request) {
        // 1. Find user by email
        AuthRepository.UserRecord user = authRepository.findUserByEmail(request.getEmail());
        if (user == null) {
            throw new com.example.medifind_springv.modules.auth.exception.InvalidCredentialsException("Correo o contraseña incorrectos.");
        }

        // 2. Validate password
        if (!passwordEncoder.matches(request.getPassword(), user.passwordHash)) {
            throw new com.example.medifind_springv.modules.auth.exception.InvalidCredentialsException("Correo o contraseña incorrectos.");
        }

        // 3. Validate status is active
        if (!"activo".equalsIgnoreCase(user.estado)) {
            throw new com.example.medifind_springv.modules.auth.exception.UserInactiveException("El usuario no está activo.");
        }

        // 4. Resolve profileId, accountType, role, and defaultRoute
        String profileId = "";
        String accountType = "";
        String role = "";
        String displayName = user.nombre;
        String defaultRoute = "/";

        if ("doctor".equalsIgnoreCase(user.rol)) {
            AuthRepository.DoctorRecord doc = authRepository.findDoctorByUserId(user.id);
            if (doc == null) {
                throw new com.example.medifind_springv.modules.auth.exception.InvalidCredentialsException("Perfil de doctor no encontrado.");
            }
            profileId = doc.id.toString();
            accountType = "DOCTOR";
            role = "DOCTOR";
            displayName = doc.nombreProfesional;
            defaultRoute = "/doctor/calendar";
        } else if ("paciente".equalsIgnoreCase(user.rol)) {
            UUID patId = authRepository.findPatientByUserId(user.id);
            if (patId == null) {
                throw new com.example.medifind_springv.modules.auth.exception.InvalidCredentialsException("Perfil de paciente no encontrado.");
            }
            profileId = patId.toString();
            accountType = "PATIENT";
            role = "PACIENTE";
            defaultRoute = "/";
        } else {
            role = user.rol.toUpperCase();
            accountType = user.rol.toUpperCase();
        }

        // Generate JWT Token
        Map<String, Object> claims = Map.of(
                "userId", user.id.toString(),
                "profileId", profileId,
                "role", role,
                "accountType", accountType,
                "email", user.email
        );
        String token = jwtService.generateToken(user.email, claims);

        return new com.example.medifind_springv.modules.auth.dto.LoginResponse(
                token,
                "Bearer",
                user.id.toString(),
                profileId,
                accountType,
                role,
                user.nombre,
                displayName,
                user.email,
                user.telefono,
                defaultRoute,
                "Inicio de sesión exitoso"
        );
    }
}
