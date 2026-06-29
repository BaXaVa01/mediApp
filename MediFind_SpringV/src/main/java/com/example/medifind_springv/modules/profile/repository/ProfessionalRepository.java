package com.example.medifind_springv.modules.profile.repository;

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.stereotype.Repository;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.core.type.TypeReference;
import com.example.medifind_springv.modules.profile.dto.*;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Repository
public class ProfessionalRepository {

    private final NamedParameterJdbcTemplate jdbcTemplate;
    private final ObjectMapper objectMapper;

    public ProfessionalRepository(NamedParameterJdbcTemplate jdbcTemplate, ObjectMapper objectMapper) {
        this.jdbcTemplate = jdbcTemplate;
        this.objectMapper = objectMapper;
    }

    public List<ProfessionalProfileDTO> findAll() {
        String sql = "SELECT id FROM doctor";
        List<UUID> ids = jdbcTemplate.query(sql, new MapSqlParameterSource(), (rs, rowNum) -> toUUID(rs.getObject("id")));
        return findByIds(ids);
    }

    public Optional<ProfessionalProfileDTO> findById(UUID doctorId) {
        List<ProfessionalProfileDTO> profiles = findByIds(Collections.singletonList(doctorId));
        if (profiles.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(profiles.get(0));
    }

    public List<ProfessionalProfileDTO> search(String query) {
        if (query == null || query.trim().isEmpty()) {
            return findAll();
        }
        String sql = "SELECT DISTINCT d.id FROM doctor d " +
                "LEFT JOIN doctor_especialidad de ON d.id = de.doctor_id " +
                "LEFT JOIN especialidad e ON de.especialidad_id = e.id " +
                "LEFT JOIN lugar_atencion la ON d.id = la.doctor_id AND la.activo = true " +
                "LEFT JOIN servicio s ON d.id = s.doctor_id AND s.activo = true " +
                "WHERE LOWER(d.nombre_profesional) LIKE :query " +
                "   OR LOWER(e.nombre) LIKE :query " +
                "   OR LOWER(d.biografia) LIKE :query " +
                "   OR LOWER(la.ciudad) LIKE :query " +
                "   OR LOWER(la.direccion) LIKE :query " +
                "   OR LOWER(s.nombre) LIKE :query";
        
        MapSqlParameterSource params = new MapSqlParameterSource("query", "%" + query.toLowerCase() + "%");
        List<UUID> ids = jdbcTemplate.query(sql, params, (rs, rowNum) -> toUUID(rs.getObject("id")));
        return findByIds(ids);
    }

    public List<ProfessionalProfileDTO> findByIds(List<UUID> doctorIds) {
        if (doctorIds == null || doctorIds.isEmpty()) {
            return new ArrayList<>();
        }

        // 1. Fetch Doctor main info
        String doctorSql = "SELECT id, nombre_profesional, biografia, foto_url, numero_licencia FROM doctor WHERE id IN (:ids)";
        MapSqlParameterSource params = new MapSqlParameterSource("ids", doctorIds);
        
        List<ProfessionalProfileDTO> profilesList = jdbcTemplate.query(doctorSql, params, (rs, rowNum) -> {
            ProfessionalProfileDTO dto = new ProfessionalProfileDTO();
            dto.setId(rs.getString("id"));
            dto.setName(rs.getString("nombre_profesional"));
            dto.setBio(rs.getString("biografia") != null ? rs.getString("biografia") : "");
            dto.setPhoto(rs.getString("foto_url") != null ? rs.getString("foto_url") : "");
            dto.setLicenseNumber(rs.getString("numero_licencia") != null ? rs.getString("numero_licencia") : "");
            return dto;
        });

        if (profilesList.isEmpty()) {
            return new ArrayList<>();
        }

        Map<UUID, ProfessionalProfileDTO> profilesMap = new LinkedHashMap<>();
        for (ProfessionalProfileDTO profile : profilesList) {
            profilesMap.put(UUID.fromString(profile.getId()), profile);
        }

        // 2. Fetch Specialties
        String specialtySql = "SELECT de.doctor_id, e.nombre FROM doctor_especialidad de " +
                "JOIN especialidad e ON de.especialidad_id = e.id " +
                "WHERE de.doctor_id IN (:ids)";
        
        jdbcTemplate.query(specialtySql, params, rs -> {
            UUID docId = toUUID(rs.getObject("doctor_id"));
            String specName = rs.getString("nombre");
            ProfessionalProfileDTO dto = profilesMap.get(docId);
            if (dto != null) {
                if (dto.getSpecialty() == null || dto.getSpecialty().isEmpty()) {
                    dto.setSpecialty(specName != null ? specName : "");
                }
            }
        });

        // 3. Fetch Services
        String serviceSql = "SELECT s.doctor_id, s.nombre, s.precio, s.duracion_minutos FROM servicio s " +
                "WHERE s.doctor_id IN (:ids) AND s.activo = true " +
                "AND (s.clinica_id IS NULL OR EXISTS (" +
                "    SELECT 1 FROM doctor_clinica dc " +
                "    WHERE dc.doctor_id = s.doctor_id " +
                "      AND dc.clinica_id = s.clinica_id " +
                "      AND dc.activo = true" +
                "))";
        
        Map<UUID, List<ServiceDetailDTO>> servicesMap = new HashMap<>();
        jdbcTemplate.query(serviceSql, params, rs -> {
            UUID docId = toUUID(rs.getObject("doctor_id"));
            String sName = rs.getString("nombre");
            Double sPrice = toDouble(rs.getObject("precio"));
            Integer sDuration = toInteger(rs.getObject("duracion_minutos"));
            
            ServiceDetailDTO serviceDetail = new ServiceDetailDTO(
                    sName != null ? sName : "",
                    sPrice != null ? sPrice : 0.0,
                    sDuration != null ? sDuration + " min" : "0 min"
            );
            
            servicesMap.computeIfAbsent(docId, k -> new ArrayList<>()).add(serviceDetail);
        });

        for (Map.Entry<UUID, List<ServiceDetailDTO>> entry : servicesMap.entrySet()) {
            ProfessionalProfileDTO dto = profilesMap.get(entry.getKey());
            if (dto != null) {
                dto.setServicesDetails(entry.getValue());
                dto.setServices(entry.getValue().stream().map(ServiceDetailDTO::getName).collect(Collectors.toList()));
                
                // Set price as the minimum price of active services, or first if simpler
                double minPrice = entry.getValue().stream()
                        .mapToDouble(ServiceDetailDTO::getPrice)
                        .min()
                        .orElse(0.0);
                dto.setPrice(minPrice);
            }
        }

        // 4. Fetch Locations
        String locationSql = "SELECT la.doctor_id, la.id, la.nombre, la.direccion, la.ciudad, la.latitud, la.longitud, la.es_principal, la.clinica_id, " +
                "c.nombre AS clinica_nombre, c.direccion AS clinica_direccion, c.ciudad AS clinica_ciudad, c.telefono AS clinica_telefono " +
                "FROM lugar_atencion la " +
                "LEFT JOIN doctor_clinica dc ON la.clinica_id = dc.clinica_id AND dc.doctor_id = la.doctor_id AND dc.activo = true " +
                "LEFT JOIN clinica c ON dc.clinica_id = c.id " +
                "WHERE la.doctor_id IN (:ids) AND la.activo = true " +
                "AND (la.clinica_id IS NULL OR dc.id IS NOT NULL)";
        
        // We will keep location list for later schedule filtering as well
        Map<UUID, List<LocationTemp>> rawLocationsMap = new HashMap<>();
        
        jdbcTemplate.query(locationSql, params, rs -> {
            UUID docId = toUUID(rs.getObject("doctor_id"));
            UUID locId = toUUID(rs.getObject("id"));
            String locName = rs.getString("nombre");
            String address = rs.getString("direccion");
            String ciudad = rs.getString("ciudad");
            Double lat = toDouble(rs.getObject("latitud"));
            Double lng = toDouble(rs.getObject("longitud"));
            boolean esPrincipal = rs.getBoolean("es_principal");
            
            String clinicaNombre = rs.getString("clinica_nombre");
            String clinicaDireccion = rs.getString("clinica_direccion");
            String clinicaCiudad = rs.getString("clinica_ciudad");
            String clinicaTelefono = rs.getString("clinica_telefono");
            
            LocationTemp loc = new LocationTemp();
            loc.id = locId;
            loc.name = locName != null ? locName : (clinicaNombre != null ? clinicaNombre : "");
            
            // Format address
            String finalAddress = address != null ? address : (clinicaDireccion != null ? clinicaDireccion : "");
            String finalCity = ciudad != null ? ciudad : (clinicaCiudad != null ? clinicaCiudad : "");
            if (!finalCity.isEmpty() && !finalAddress.contains(finalCity)) {
                finalAddress = finalAddress + ", " + finalCity;
            }
            loc.address = finalAddress;
            loc.lat = lat != null ? lat : 0.0;
            loc.lng = lng != null ? lng : 0.0;
            loc.phone = clinicaTelefono != null ? clinicaTelefono : "";
            loc.esPrincipal = esPrincipal;
            
            rawLocationsMap.computeIfAbsent(docId, k -> new ArrayList<>()).add(loc);
        });

        // 5. Fetch Schedules (we need this to format location availability)
        String scheduleSql = "SELECT ha.doctor_id, ha.dia_semana, ha.hora_inicio, ha.hora_fin, ha.duracion_cita_minutos, ha.lugar_atencion_id " +
                "FROM horario_atencion ha " +
                "WHERE ha.doctor_id IN (:ids) AND ha.activo = true " +
                "ORDER BY ha.dia_semana ASC, ha.hora_inicio ASC";
        
        Map<UUID, List<ScheduleTemp>> rawSchedulesMap = new HashMap<>();
        jdbcTemplate.query(scheduleSql, params, rs -> {
            UUID docId = toUUID(rs.getObject("doctor_id"));
            ScheduleTemp temp = new ScheduleTemp();
            temp.diaSemana = rs.getInt("dia_semana");
            temp.horaInicio = toLocalTime(rs.getObject("hora_inicio"));
            temp.horaFin = toLocalTime(rs.getObject("hora_fin"));
            temp.duracionCitaMinutos = rs.getInt("duracion_cita_minutos");
            temp.lugarAtencionId = toUUID(rs.getObject("lugar_atencion_id"));
            
            rawSchedulesMap.computeIfAbsent(docId, k -> new ArrayList<>()).add(temp);
        });

        // Now populate locations and careLocations for each doctor
        for (UUID docId : doctorIds) {
            ProfessionalProfileDTO dto = profilesMap.get(docId);
            if (dto == null) continue;
            
            List<LocationTemp> locs = rawLocationsMap.getOrDefault(docId, new ArrayList<>());
            List<ScheduleTemp> schedules = rawSchedulesMap.getOrDefault(docId, new ArrayList<>());
            
            List<LocationDTO> locDTOs = new ArrayList<>();
            List<CareLocationDTO> careLocDTOs = new ArrayList<>();
            LocationDTO principalLoc = null;
            
            for (LocationTemp l : locs) {
                LocationDTO lDTO = new LocationDTO(l.lat, l.lng, l.address);
                locDTOs.add(lDTO);
                
                if (l.esPrincipal) {
                    principalLoc = lDTO;
                }
                
                // Format location-specific availability
                List<ScheduleTemp> locSchedules = schedules.stream()
                        .filter(s -> l.id.equals(s.lugarAtencionId))
                        .collect(Collectors.toList());
                
                String availStr = formatLocationAvailability(locSchedules);
                
                CareLocationDTO cDTO = new CareLocationDTO(
                        l.name,
                        l.address,
                        l.phone,
                        availStr
                );
                careLocDTOs.add(cDTO);
            }
            
            if (principalLoc == null && !locDTOs.isEmpty()) {
                principalLoc = locDTOs.get(0);
            }
            
            dto.setLocation(principalLoc);
            dto.setLocations(locDTOs);
            dto.setCareLocations(careLocDTOs);
            
            // Format global schedule and availability days
            List<String> availDays = new ArrayList<>();
            Set<Integer> uniqueDays = new TreeSet<>();
            Map<Integer, List<ScheduleTemp>> schedulesByDay = new TreeMap<>();
            
            for (ScheduleTemp s : schedules) {
                uniqueDays.add(s.diaSemana);
                schedulesByDay.computeIfAbsent(s.diaSemana, k -> new ArrayList<>()).add(s);
            }
            
            for (Integer dayNum : uniqueDays) {
                availDays.add(getDayName(dayNum));
            }
            dto.setAvailability(availDays);
            
            List<ScheduleDTO> schedDTOs = new ArrayList<>();
            for (Map.Entry<Integer, List<ScheduleTemp>> dayEntry : schedulesByDay.entrySet()) {
                String dayName = getDayName(dayEntry.getKey());
                String hoursStr = dayEntry.getValue().stream()
                        .map(s -> formatTimeRange(s.horaInicio, s.horaFin))
                        .collect(Collectors.joining(", "));
                schedDTOs.add(new ScheduleDTO(dayName, hoursStr));
            }
            dto.setSchedule(schedDTOs);
        }

        // 6. Fetch Appointments
        String appointmentSql = "SELECT c.doctor_id, c.id, c.fecha, c.hora_inicio, c.hora_fin, c.estado, " +
                "s.nombre AS servicio_nombre, u.nombre AS paciente_nombre " +
                "FROM cita c " +
                "LEFT JOIN servicio s ON c.servicio_id = s.id " +
                "LEFT JOIN paciente p ON c.paciente_id = p.id " +
                "LEFT JOIN usuario u ON p.usuario_id = u.id " +
                "WHERE c.doctor_id IN (:ids) " +
                "ORDER BY c.fecha DESC, c.hora_inicio DESC";
        
        Map<UUID, List<AppointmentTemp>> rawAppointmentsMap = new HashMap<>();
        jdbcTemplate.query(appointmentSql, params, rs -> {
            UUID docId = toUUID(rs.getObject("doctor_id"));
            AppointmentTemp appt = new AppointmentTemp();
            appt.id = rs.getString("id");
            appt.fecha = toLocalDate(rs.getObject("fecha"));
            appt.horaInicio = toLocalTime(rs.getObject("hora_inicio"));
            appt.horaFin = toLocalTime(rs.getObject("hora_fin"));
            appt.estado = rs.getString("estado");
            appt.servicioNombre = rs.getString("servicio_nombre");
            appt.pacienteNombre = rs.getString("paciente_nombre");
            
            rawAppointmentsMap.computeIfAbsent(docId, k -> new ArrayList<>()).add(appt);
        });

        for (UUID docId : doctorIds) {
            ProfessionalProfileDTO dto = profilesMap.get(docId);
            if (dto == null) continue;
            
            List<AppointmentTemp> appts = rawAppointmentsMap.getOrDefault(docId, new ArrayList<>());
            List<AppointmentSummaryDTO> apptDTOs = appts.stream().map(a -> new AppointmentSummaryDTO(
                    a.id,
                    a.pacienteNombre != null ? a.pacienteNombre : "Paciente",
                    a.horaInicio != null ? a.horaInicio.format(DateTimeFormatter.ofPattern("HH:mm")) : "",
                    a.fecha != null ? a.fecha.toString() : "",
                    a.servicioNombre != null ? a.servicioNombre : "Consulta",
                    translateStatus(a.estado)
            )).collect(Collectors.toList());
            
            dto.setAppointments(apptDTOs);
        }

        // 7. Fetch Reviews
        String reviewSql = "SELECT r.doctor_id, r.id, r.calificacion, r.comentario, r.creado_en, " +
                "u.nombre AS paciente_nombre " +
                "FROM review r " +
                "LEFT JOIN paciente p ON r.paciente_id = p.id " +
                "LEFT JOIN usuario u ON p.usuario_id = u.id " +
                "WHERE r.doctor_id IN (:ids) " +
                "ORDER BY r.creado_en DESC";
        
        Map<UUID, List<ReviewDTO>> reviewsMap = new HashMap<>();
        jdbcTemplate.query(reviewSql, params, rs -> {
            UUID docId = toUUID(rs.getObject("doctor_id"));
            String patientName = rs.getString("paciente_nombre");
            String comment = rs.getString("comentario");
            Integer rating = rs.getInt("calificacion");
            Timestamp created = toTimestamp(rs.getObject("creado_en"));
            
            ReviewDTO review = new ReviewDTO(
                    patientName != null ? patientName : "Paciente Anónimo",
                    comment != null ? comment : "",
                    rating != null ? rating : 5,
                    formatReviewDate(created)
            );
            reviewsMap.computeIfAbsent(docId, k -> new ArrayList<>()).add(review);
        });

        for (UUID docId : doctorIds) {
            ProfessionalProfileDTO dto = profilesMap.get(docId);
            if (dto == null) continue;
            
            List<ReviewDTO> revList = reviewsMap.getOrDefault(docId, new ArrayList<>());
            dto.setReviews(revList);
            dto.setReviewCount(revList.size());
            
            double avgRating = 0.0;
            if (!revList.isEmpty()) {
                double total = revList.stream().mapToInt(ReviewDTO::getRating).sum();
                avgRating = total / revList.size();
                // Round to 1 decimal place
                avgRating = Math.round(avgRating * 10.0) / 10.0;
            }
            dto.setRating(avgRating);
        }

        // 8. Fetch Education
        String educationSql = "SELECT ed.doctor_id, ed.titulo, ed.institucion, ed.anio_inicio, ed.anio_fin " +
                "FROM educacion_doctor ed " +
                "WHERE ed.doctor_id IN (:ids) " +
                "ORDER BY ed.anio_inicio DESC";
        
        jdbcTemplate.query(educationSql, params, rs -> {
            UUID docId = toUUID(rs.getObject("doctor_id"));
            String titulo = rs.getString("titulo");
            String inst = rs.getString("institucion");
            
            ProfessionalProfileDTO dto = profilesMap.get(docId);
            if (dto != null) {
                String t = (titulo != null ? titulo : "") + " (" + (inst != null ? inst : "") + ")";
                String e = (inst != null ? inst : "") + " - " + (titulo != null ? titulo : "");
                dto.getTitles().add(t);
                dto.getEducation().add(e);
            }
        });

        // 9. Fetch Experience
        String experienceSql = "SELECT ex.doctor_id, ex.cargo, ex.institucion, ex.anio_inicio, ex.anio_fin, ex.descripcion " +
                "FROM experiencia_doctor ex " +
                "WHERE ex.doctor_id IN (:ids) " +
                "ORDER BY ex.anio_inicio DESC";
        
        Map<UUID, Integer> minStartYearMap = new HashMap<>();
        jdbcTemplate.query(experienceSql, params, rs -> {
            UUID docId = toUUID(rs.getObject("doctor_id"));
            Integer startYear = toInteger(rs.getObject("anio_inicio"));
            if (startYear != null) {
                minStartYearMap.merge(docId, startYear, Math::min);
            }
        });

        int currentYear = LocalDate.now().getYear();
        for (UUID docId : doctorIds) {
            ProfessionalProfileDTO dto = profilesMap.get(docId);
            if (dto == null) continue;
            
            Integer minStart = minStartYearMap.get(docId);
            if (minStart != null) {
                int expYears = currentYear - minStart;
                dto.setExperience(expYears > 0 ? expYears + " años" : "0 años");
            } else {
                dto.setExperience("");
            }
        }

        // 10. Fetch Extra Profile
        String extraSql = "SELECT doctor_id, premios, seguros, enfermedades_tratadas, tipos_paciente, certificaciones, idiomas, publicaciones, tipos_consulta " +
                "FROM doctor_perfil_extra " +
                "WHERE doctor_id IN (:ids)";
        
        jdbcTemplate.query(extraSql, params, rs -> {
            UUID docId = toUUID(rs.getObject("doctor_id"));
            ProfessionalProfileDTO dto = profilesMap.get(docId);
            if (dto != null) {
                dto.setAwards(parseJsonArray(rs.getString("premios")));
                dto.setInsurance(parseJsonArray(rs.getString("seguros")));
                dto.setDiseasesTreated(parseJsonArray(rs.getString("enfermedades_tratadas")));
                dto.setPatientTypes(parseJsonArray(rs.getString("tipos_paciente")));
                dto.setCertifications(parseJsonArray(rs.getString("certificaciones")));
                dto.setLanguages(parseJsonArray(rs.getString("idiomas")));
                dto.setPublications(parseJsonArray(rs.getString("publicaciones")));
                dto.setConsultationTypes(parseJsonArray(rs.getString("tipos_consulta")));
            }
        });

        // 11. Fetch Clinic Gallery
        String gallerySql = "SELECT dc.doctor_id, gc.imagen_url " +
                "FROM galeria_clinica gc " +
                "JOIN doctor_clinica dc ON gc.clinica_id = dc.clinica_id " +
                "WHERE dc.doctor_id IN (:ids) AND dc.activo = true " +
                "ORDER BY gc.orden ASC";
        
        jdbcTemplate.query(gallerySql, params, rs -> {
            UUID docId = toUUID(rs.getObject("doctor_id"));
            String imgUrl = rs.getString("imagen_url");
            ProfessionalProfileDTO dto = profilesMap.get(docId);
            if (dto != null && imgUrl != null) {
                dto.getGallery().add(imgUrl);
            }
        });

        // 12. Fetch Blockages
        String blockSql = "SELECT db.doctor_id, db.fecha, db.hora_inicio, db.hora_fin " +
                "FROM disponibilidad_bloqueo db " +
                "WHERE db.doctor_id IN (:ids)";
        
        Map<UUID, List<BlockTemp>> rawBlocksMap = new HashMap<>();
        jdbcTemplate.query(blockSql, params, rs -> {
            UUID docId = toUUID(rs.getObject("doctor_id"));
            BlockTemp b = new BlockTemp();
            b.fecha = toLocalDate(rs.getObject("fecha"));
            b.horaInicio = toLocalTime(rs.getObject("hora_inicio"));
            b.horaFin = toLocalTime(rs.getObject("hora_fin"));
            rawBlocksMap.computeIfAbsent(docId, k -> new ArrayList<>()).add(b);
        });

        // 13. Calculate availabilityPreview for each doctor
        for (UUID docId : doctorIds) {
            ProfessionalProfileDTO dto = profilesMap.get(docId);
            if (dto == null) continue;
            
            List<ScheduleTemp> schedules = rawSchedulesMap.getOrDefault(docId, new ArrayList<>());
            List<AppointmentTemp> appts = rawAppointmentsMap.getOrDefault(docId, new ArrayList<>());
            List<BlockTemp> blocks = rawBlocksMap.getOrDefault(docId, new ArrayList<>());
            
            List<AvailabilityPreviewDTO> preview = calculateAvailabilityPreview(schedules, appts, blocks);
            dto.setAvailabilityPreview(preview);
        }

        // Return profiles in the original requested order
        List<ProfessionalProfileDTO> orderedResult = new ArrayList<>();
        for (UUID id : doctorIds) {
            ProfessionalProfileDTO p = profilesMap.get(id);
            if (p != null) {
                orderedResult.add(p);
            }
        }
        return orderedResult;
    }

    // Helper classes for processing data in memory
    private static class LocationTemp {
        UUID id;
        String name;
        String address;
        double lat;
        double lng;
        String phone;
        boolean esPrincipal;
    }

    private static class ScheduleTemp {
        int diaSemana;
        LocalTime horaInicio;
        LocalTime horaFin;
        int duracionCitaMinutos;
        UUID lugarAtencionId;
    }

    private static class AppointmentTemp {
        String id;
        LocalDate fecha;
        LocalTime horaInicio;
        LocalTime horaFin;
        String estado;
        String servicioNombre;
        String pacienteNombre;
    }

    private static class BlockTemp {
        LocalDate fecha;
        LocalTime horaInicio;
        LocalTime horaFin;
    }

    private UUID toUUID(Object obj) {
        if (obj == null) return null;
        if (obj instanceof UUID) {
            return (UUID) obj;
        }
        return UUID.fromString(obj.toString());
    }

    private Double toDouble(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Number) {
            return ((Number) obj).doubleValue();
        }
        try {
            return Double.parseDouble(obj.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private Integer toInteger(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Number) {
            return ((Number) obj).intValue();
        }
        try {
            return Integer.parseInt(obj.toString());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private LocalTime toLocalTime(Object obj) {
        if (obj == null) return null;
        if (obj instanceof LocalTime) {
            return (LocalTime) obj;
        }
        if (obj instanceof java.sql.Time) {
            return ((java.sql.Time) obj).toLocalTime();
        }
        try {
            return LocalTime.parse(obj.toString());
        } catch (Exception e) {
            return null;
        }
    }

    private LocalDate toLocalDate(Object obj) {
        if (obj == null) return null;
        if (obj instanceof LocalDate) {
            return (LocalDate) obj;
        }
        if (obj instanceof java.sql.Date) {
            return ((java.sql.Date) obj).toLocalDate();
        }
        try {
            return LocalDate.parse(obj.toString());
        } catch (Exception e) {
            return null;
        }
    }

    private Timestamp toTimestamp(Object obj) {
        if (obj == null) return null;
        if (obj instanceof Timestamp) {
            return (Timestamp) obj;
        }
        if (obj instanceof java.util.Date) {
            return new Timestamp(((java.util.Date) obj).getTime());
        }
        try {
            return Timestamp.valueOf(obj.toString());
        } catch (Exception e) {
            return null;
        }
    }

    private List<String> parseJsonArray(String json) {
        if (json == null || json.trim().isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            try {
                String val = objectMapper.readValue(json, String.class);
                List<String> list = new ArrayList<>();
                list.add(val);
                return list;
            } catch (Exception e2) {
                // Return fallback: check if it contains comma separated values or clean up square brackets
                String clean = json.replace("[", "").replace("]", "").replace("\"", "").trim();
                if (clean.isEmpty()) return new ArrayList<>();
                return Arrays.stream(clean.split(","))
                        .map(String::trim)
                        .filter(s -> !s.isEmpty())
                        .collect(Collectors.toList());
            }
        }
    }

    private String getDayName(int dayNum) {
        switch (dayNum) {
            case 1: return "Lunes";
            case 2: return "Martes";
            case 3: return "Miércoles";
            case 4: return "Jueves";
            case 5: return "Viernes";
            case 6: return "Sábado";
            case 7: return "Domingo";
            default: return "";
        }
    }

    private String getShortDayName(int dayNum) {
        switch (dayNum) {
            case 1: return "Lun";
            case 2: return "Mar";
            case 3: return "Mié";
            case 4: return "Jue";
            case 5: return "Vie";
            case 6: return "Sáb";
            case 7: return "Dom";
            default: return "";
        }
    }

    private String formatTimeRange(LocalTime start, LocalTime end) {
        if (start == null || end == null) return "";
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("HH:mm");
        return start.format(fmt) + " - " + end.format(fmt);
    }

    private String formatLocationAvailability(List<ScheduleTemp> schedules) {
        if (schedules == null || schedules.isEmpty()) {
            return "Bajo cita";
        }
        
        // Group schedules by weekday
        Map<Integer, List<ScheduleTemp>> dayMap = new TreeMap<>();
        for (ScheduleTemp s : schedules) {
            dayMap.computeIfAbsent(s.diaSemana, k -> new ArrayList<>()).add(s);
        }
        
        List<String> dayHoursList = new ArrayList<>();
        for (Map.Entry<Integer, List<ScheduleTemp>> entry : dayMap.entrySet()) {
            String dayShort = getShortDayName(entry.getKey());
            String hours = entry.getValue().stream()
                    .map(s -> formatTimeRange(s.horaInicio, s.horaFin))
                    .collect(Collectors.joining(", "));
            dayHoursList.add(dayShort + ": " + hours);
        }
        
        return String.join("; ", dayHoursList);
    }

    private String formatReviewDate(Timestamp created) {
        if (created == null) return "";
        LocalDateTime ldt = created.toLocalDateTime();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("d MMM yyyy", Locale.ENGLISH);
        return ldt.format(formatter);
    }

    private String translateStatus(String status) {
        if (status == null) return "";
        status = status.toUpperCase();
        switch (status) {
            case "CONFIRMADA":
            case "CONFIRMED":
                return "Confirmada";
            case "PENDIENTE":
            case "PENDING":
                return "Pendiente";
            case "CANCELADA":
            case "CANCELLED":
                return "Cancelada";
            case "COMPLETADA":
            case "COMPLETED":
                return "Completada";
            default:
                if (status.length() > 0) {
                    return status.substring(0, 1).toUpperCase() + status.substring(1).toLowerCase();
                }
                return status;
        }
    }

    private List<AvailabilityPreviewDTO> calculateAvailabilityPreview(
            List<ScheduleTemp> schedules,
            List<AppointmentTemp> appointments,
            List<BlockTemp> blocks) {
            
        List<AvailabilityPreviewDTO> preview = new ArrayList<>();
        if (schedules == null || schedules.isEmpty()) {
            return preview;
        }

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        
        // Group schedules by day of week
        Map<Integer, List<ScheduleTemp>> schedulesByDayOfWeek = schedules.stream()
                .collect(Collectors.groupingBy(s -> s.diaSemana));

        // Scan next 14 days
        for (int i = 0; i < 14 && preview.size() < 3; i++) {
            LocalDate date = today.plusDays(i);
            int dayOfWeek = date.getDayOfWeek().getValue(); // 1 = Monday, ..., 7 = Sunday
            
            List<ScheduleTemp> daySchedules = schedulesByDayOfWeek.get(dayOfWeek);
            if (daySchedules == null || daySchedules.isEmpty()) {
                continue;
            }
            
            // Format the date label
            String dateLabel;
            if (i == 0) {
                dateLabel = "Hoy";
            } else if (i == 1) {
                dateLabel = "Mañana";
            } else {
                dateLabel = getShortDayName(dayOfWeek) + ", " + date.getDayOfMonth();
            }

            // For the selected date, get all appointments and blocks to check for conflicts
            final LocalDate currentDate = date;
            List<AppointmentTemp> dateAppts = appointments.stream()
                    .filter(a -> currentDate.equals(a.fecha) && !"CANCELADA".equalsIgnoreCase(a.estado))
                    .collect(Collectors.toList());
            List<BlockTemp> dateBlocks = blocks.stream()
                    .filter(b -> currentDate.equals(b.fecha))
                    .collect(Collectors.toList());

            // Generate slots for each schedule block
            List<LocalTime> daySlots = new ArrayList<>();
            for (ScheduleTemp s : daySchedules) {
                int duration = s.duracionCitaMinutos > 0 ? s.duracionCitaMinutos : 30;
                LocalTime tempTime = s.horaInicio;
                
                while (tempTime.plusMinutes(duration).compareTo(s.horaFin) <= 0) {
                    LocalTime slotStart = tempTime;
                    LocalTime slotEnd = tempTime.plusMinutes(duration);
                    
                    // Skip if date is today and slot is in the past
                    if (currentDate.equals(today) && slotStart.compareTo(now) < 0) {
                        tempTime = slotEnd;
                        continue;
                    }
                    
                    // Check overlap with appointments
                    boolean apptOverlap = dateAppts.stream().anyMatch(a -> 
                            isOverlapping(slotStart, slotEnd, a.horaInicio, a.horaFin));
                            
                    // Check overlap with blocks
                    boolean blockOverlap = dateBlocks.stream().anyMatch(b -> 
                            isOverlapping(slotStart, slotEnd, b.horaInicio, b.horaFin));
                            
                    if (!apptOverlap && !blockOverlap) {
                        daySlots.add(slotStart);
                    }
                    
                    tempTime = slotEnd;
                }
            }
            
            // Sort times for the day
            Collections.sort(daySlots);
            
            // Add slots to preview
            for (LocalTime t : daySlots) {
                String timeStr = t.format(DateTimeFormatter.ofPattern("HH:mm"));
                preview.add(new AvailabilityPreviewDTO(dateLabel, timeStr));
                if (preview.size() >= 3) {
                    break;
                }
            }
        }
        
        return preview;
    }

    private boolean isOverlapping(LocalTime start1, LocalTime end1, LocalTime start2, LocalTime end2) {
        if (start1 == null || end1 == null || start2 == null || end2 == null) {
            return false;
        }
        return !(start1.compareTo(end2) >= 0 || end1.compareTo(start2) <= 0);
    }
}
