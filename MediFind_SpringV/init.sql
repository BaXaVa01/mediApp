--
-- PostgreSQL database dump
--

\restrict UAIEWFIvTPqTd7n94agRoZLGcgB9cYQu677LvlxS4uwUo1rQNt3r2shdtbA5jJb

-- Dumped from database version 15.17 (Debian 15.17-1.pgdg13+1)
-- Dumped by pg_dump version 16.14 (Ubuntu 16.14-0ubuntu0.24.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: estado_cita; Type: TYPE; Schema: public; Owner: baxava
--

CREATE TYPE public.estado_cita AS ENUM (
    'pendiente',
    'confirmada',
    'cancelada',
    'completada',
    'bloqueada'
);


ALTER TYPE public.estado_cita OWNER TO baxava;

--
-- Name: estado_usuario; Type: TYPE; Schema: public; Owner: baxava
--

CREATE TYPE public.estado_usuario AS ENUM (
    'activo',
    'inactivo',
    'suspendido'
);


ALTER TYPE public.estado_usuario OWNER TO baxava;

--
-- Name: genero_paciente; Type: TYPE; Schema: public; Owner: baxava
--

CREATE TYPE public.genero_paciente AS ENUM (
    'masculino',
    'femenino',
    'otro',
    'no_especificado'
);


ALTER TYPE public.genero_paciente OWNER TO baxava;

--
-- Name: rol_usuario; Type: TYPE; Schema: public; Owner: baxava
--

CREATE TYPE public.rol_usuario AS ENUM (
    'paciente',
    'doctor',
    'clinica',
    'admin'
);


ALTER TYPE public.rol_usuario OWNER TO baxava;

--
-- Name: tipo_lugar_atencion; Type: TYPE; Schema: public; Owner: baxava
--

CREATE TYPE public.tipo_lugar_atencion AS ENUM (
    'clinica',
    'consultorio_privado',
    'casa',
    'domicilio',
    'online'
);


ALTER TYPE public.tipo_lugar_atencion OWNER TO baxava;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categoria; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.categoria (
    id bigint NOT NULL,
    nombre character varying(100) NOT NULL
);


ALTER TABLE public.categoria OWNER TO baxava;

--
-- Name: categoria_id_seq; Type: SEQUENCE; Schema: public; Owner: baxava
--

CREATE SEQUENCE public.categoria_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categoria_id_seq OWNER TO baxava;

--
-- Name: categoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: baxava
--

ALTER SEQUENCE public.categoria_id_seq OWNED BY public.categoria.id;


--
-- Name: cita; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.cita (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    paciente_id uuid NOT NULL,
    doctor_id uuid NOT NULL,
    clinica_id uuid,
    lugar_atencion_id uuid NOT NULL,
    servicio_id uuid,
    fecha date NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    estado public.estado_cita DEFAULT 'pendiente'::public.estado_cita NOT NULL,
    motivo_consulta text,
    notas text,
    precio_reservado numeric(10,2),
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT cita_check CHECK ((hora_inicio < hora_fin)),
    CONSTRAINT cita_precio_reservado_check CHECK (((precio_reservado IS NULL) OR (precio_reservado >= (0)::numeric)))
);


ALTER TABLE public.cita OWNER TO baxava;

--
-- Name: clinica; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.clinica (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    usuario_id uuid NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    logo_url text,
    portada_url text,
    telefono character varying(30),
    email_contacto character varying(150),
    direccion text NOT NULL,
    ciudad character varying(100),
    latitud numeric(10,7),
    longitud numeric(10,7),
    verificada boolean DEFAULT false NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.clinica OWNER TO baxava;

--
-- Name: clinica_especialidad; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.clinica_especialidad (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    clinica_id uuid NOT NULL,
    especialidad_id uuid NOT NULL
);


ALTER TABLE public.clinica_especialidad OWNER TO baxava;

--
-- Name: detalle_pedido; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.detalle_pedido (
    id bigint NOT NULL,
    pedido_id bigint NOT NULL,
    producto_id bigint NOT NULL,
    cantidad integer NOT NULL,
    precio_unitario numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    CONSTRAINT detalle_pedido_cantidad_check CHECK ((cantidad > 0)),
    CONSTRAINT detalle_pedido_precio_unitario_check CHECK ((precio_unitario >= (0)::numeric)),
    CONSTRAINT detalle_pedido_subtotal_check CHECK ((subtotal >= (0)::numeric))
);


ALTER TABLE public.detalle_pedido OWNER TO baxava;

--
-- Name: detalle_pedido_id_seq; Type: SEQUENCE; Schema: public; Owner: baxava
--

CREATE SEQUENCE public.detalle_pedido_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.detalle_pedido_id_seq OWNER TO baxava;

--
-- Name: detalle_pedido_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: baxava
--

ALTER SEQUENCE public.detalle_pedido_id_seq OWNED BY public.detalle_pedido.id;


--
-- Name: disponibilidad_bloqueo; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.disponibilidad_bloqueo (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    doctor_id uuid NOT NULL,
    lugar_atencion_id uuid,
    fecha date NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    motivo text,
    CONSTRAINT disponibilidad_bloqueo_check CHECK ((hora_inicio < hora_fin))
);


ALTER TABLE public.disponibilidad_bloqueo OWNER TO baxava;

--
-- Name: doctor; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.doctor (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    usuario_id uuid NOT NULL,
    nombre_profesional character varying(150) NOT NULL,
    biografia text,
    foto_url text,
    numero_licencia character varying(80),
    verificado boolean DEFAULT false NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    headline character varying(160),
    anios_experiencia integer,
    telefono_publico character varying(30),
    email_publico character varying(150),
    ciudad character varying(100),
    resumen_ubicacion character varying(255),
    perfil_visible boolean DEFAULT false NOT NULL,
    consulta_en_linea boolean DEFAULT false NOT NULL,
    actualizado_en timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.doctor OWNER TO baxava;

--
-- Name: doctor_clinica; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.doctor_clinica (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    doctor_id uuid NOT NULL,
    clinica_id uuid NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    notas text
);


ALTER TABLE public.doctor_clinica OWNER TO baxava;

--
-- Name: doctor_especialidad; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.doctor_especialidad (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    doctor_id uuid NOT NULL,
    especialidad_id uuid NOT NULL
);


ALTER TABLE public.doctor_especialidad OWNER TO baxava;

--
-- Name: doctor_perfil_extra; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.doctor_perfil_extra (
    doctor_id uuid NOT NULL,
    seguros text,
    tipos_consulta text,
    enfermedades_tratadas text,
    tipos_paciente text,
    certificaciones text,
    idiomas text,
    publicaciones text,
    premios text
);


ALTER TABLE public.doctor_perfil_extra OWNER TO baxava;

--
-- Name: educacion_doctor; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.educacion_doctor (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    doctor_id uuid NOT NULL,
    titulo character varying(180) NOT NULL,
    institucion character varying(180) NOT NULL,
    anio_inicio integer,
    anio_fin integer,
    descripcion text,
    CONSTRAINT educacion_doctor_check CHECK (((anio_fin IS NULL) OR (anio_inicio IS NULL) OR (anio_fin >= anio_inicio)))
);


ALTER TABLE public.educacion_doctor OWNER TO baxava;

--
-- Name: especialidad; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.especialidad (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying(120) NOT NULL,
    descripcion text
);


ALTER TABLE public.especialidad OWNER TO baxava;

--
-- Name: experiencia_doctor; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.experiencia_doctor (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    doctor_id uuid NOT NULL,
    cargo character varying(150) NOT NULL,
    institucion character varying(180) NOT NULL,
    descripcion text,
    anio_inicio integer,
    anio_fin integer,
    CONSTRAINT experiencia_doctor_check CHECK (((anio_fin IS NULL) OR (anio_inicio IS NULL) OR (anio_fin >= anio_inicio)))
);


ALTER TABLE public.experiencia_doctor OWNER TO baxava;

--
-- Name: galeria_clinica; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.galeria_clinica (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    clinica_id uuid NOT NULL,
    imagen_url text NOT NULL,
    descripcion text,
    orden integer DEFAULT 0 NOT NULL
);


ALTER TABLE public.galeria_clinica OWNER TO baxava;

--
-- Name: horario_atencion; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.horario_atencion (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    doctor_id uuid NOT NULL,
    lugar_atencion_id uuid NOT NULL,
    dia_semana smallint NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    duracion_cita_minutos integer DEFAULT 30 NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    CONSTRAINT horario_atencion_check CHECK ((hora_inicio < hora_fin)),
    CONSTRAINT horario_atencion_dia_semana_check CHECK (((dia_semana >= 1) AND (dia_semana <= 7))),
    CONSTRAINT horario_atencion_duracion_cita_minutos_check CHECK ((duracion_cita_minutos > 0))
);


ALTER TABLE public.horario_atencion OWNER TO baxava;

--
-- Name: lugar_atencion; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.lugar_atencion (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    doctor_id uuid,
    clinica_id uuid,
    nombre character varying(150) NOT NULL,
    tipo_lugar public.tipo_lugar_atencion NOT NULL,
    direccion text,
    ciudad character varying(100),
    latitud numeric(10,7),
    longitud numeric(10,7),
    es_principal boolean DEFAULT false NOT NULL,
    activo boolean DEFAULT true NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT lugar_atencion_check CHECK (((doctor_id IS NOT NULL) OR (clinica_id IS NOT NULL))),
    CONSTRAINT lugar_atencion_check1 CHECK (((tipo_lugar = 'online'::public.tipo_lugar_atencion) OR (direccion IS NOT NULL)))
);


ALTER TABLE public.lugar_atencion OWNER TO baxava;

--
-- Name: paciente; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.paciente (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    usuario_id uuid NOT NULL,
    fecha_nacimiento date,
    genero public.genero_paciente DEFAULT 'no_especificado'::public.genero_paciente,
    direccion text,
    foto_url text
);


ALTER TABLE public.paciente OWNER TO baxava;

--
-- Name: paciente_doctor_reciente; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.paciente_doctor_reciente (
    id uuid NOT NULL,
    paciente_id uuid NOT NULL,
    doctor_id uuid NOT NULL,
    visto_en timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.paciente_doctor_reciente OWNER TO baxava;

--
-- Name: pedido; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.pedido (
    id bigint NOT NULL,
    nombre_cliente character varying(150) NOT NULL,
    correo character varying(150) NOT NULL,
    comentario text,
    fecha_pedido timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    total numeric(10,2) DEFAULT 0 NOT NULL,
    CONSTRAINT pedido_total_check CHECK ((total >= (0)::numeric))
);


ALTER TABLE public.pedido OWNER TO baxava;

--
-- Name: pedido_id_seq; Type: SEQUENCE; Schema: public; Owner: baxava
--

CREATE SEQUENCE public.pedido_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pedido_id_seq OWNER TO baxava;

--
-- Name: pedido_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: baxava
--

ALTER SEQUENCE public.pedido_id_seq OWNED BY public.pedido.id;


--
-- Name: producto; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.producto (
    id bigint NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    imagen character varying(255),
    stock integer DEFAULT 0 NOT NULL,
    categoria_id bigint NOT NULL,
    CONSTRAINT producto_precio_check CHECK ((precio >= (0)::numeric)),
    CONSTRAINT producto_stock_check CHECK ((stock >= 0))
);


ALTER TABLE public.producto OWNER TO baxava;

--
-- Name: producto_id_seq; Type: SEQUENCE; Schema: public; Owner: baxava
--

CREATE SEQUENCE public.producto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_id_seq OWNER TO baxava;

--
-- Name: producto_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: baxava
--

ALTER SEQUENCE public.producto_id_seq OWNED BY public.producto.id;


--
-- Name: review; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.review (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    paciente_id uuid NOT NULL,
    doctor_id uuid,
    clinica_id uuid,
    cita_id uuid NOT NULL,
    calificacion integer NOT NULL,
    comentario text,
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT review_calificacion_check CHECK (((calificacion >= 1) AND (calificacion <= 5))),
    CONSTRAINT review_check CHECK (((doctor_id IS NOT NULL) OR (clinica_id IS NOT NULL)))
);


ALTER TABLE public.review OWNER TO baxava;

--
-- Name: servicio; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.servicio (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying(150) NOT NULL,
    descripcion text,
    precio numeric(10,2) NOT NULL,
    duracion_minutos integer DEFAULT 30 NOT NULL,
    doctor_id uuid,
    clinica_id uuid,
    lugar_atencion_id uuid,
    activo boolean DEFAULT true NOT NULL,
    CONSTRAINT servicio_check CHECK (((doctor_id IS NOT NULL) OR (clinica_id IS NOT NULL) OR (lugar_atencion_id IS NOT NULL))),
    CONSTRAINT servicio_duracion_minutos_check CHECK ((duracion_minutos > 0)),
    CONSTRAINT servicio_precio_check CHECK ((precio >= (0)::numeric))
);


ALTER TABLE public.servicio OWNER TO baxava;

--
-- Name: usuario; Type: TABLE; Schema: public; Owner: baxava
--

CREATE TABLE public.usuario (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    nombre character varying(120) NOT NULL,
    email character varying(150) NOT NULL,
    password_hash text NOT NULL,
    rol public.rol_usuario NOT NULL,
    telefono character varying(30),
    estado public.estado_usuario DEFAULT 'activo'::public.estado_usuario NOT NULL,
    creado_en timestamp without time zone DEFAULT now() NOT NULL,
    actualizado_en timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.usuario OWNER TO baxava;

--
-- Name: categoria id; Type: DEFAULT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.categoria ALTER COLUMN id SET DEFAULT nextval('public.categoria_id_seq'::regclass);


--
-- Name: detalle_pedido id; Type: DEFAULT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.detalle_pedido ALTER COLUMN id SET DEFAULT nextval('public.detalle_pedido_id_seq'::regclass);


--
-- Name: pedido id; Type: DEFAULT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.pedido ALTER COLUMN id SET DEFAULT nextval('public.pedido_id_seq'::regclass);


--
-- Name: producto id; Type: DEFAULT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.producto ALTER COLUMN id SET DEFAULT nextval('public.producto_id_seq'::regclass);


--
-- Name: categoria categoria_nombre_key; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_nombre_key UNIQUE (nombre);


--
-- Name: categoria categoria_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.categoria
    ADD CONSTRAINT categoria_pkey PRIMARY KEY (id);


--
-- Name: cita cita_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_pkey PRIMARY KEY (id);


--
-- Name: clinica_especialidad clinica_especialidad_clinica_id_especialidad_id_key; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.clinica_especialidad
    ADD CONSTRAINT clinica_especialidad_clinica_id_especialidad_id_key UNIQUE (clinica_id, especialidad_id);


--
-- Name: clinica_especialidad clinica_especialidad_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.clinica_especialidad
    ADD CONSTRAINT clinica_especialidad_pkey PRIMARY KEY (id);


--
-- Name: clinica clinica_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.clinica
    ADD CONSTRAINT clinica_pkey PRIMARY KEY (id);


--
-- Name: clinica clinica_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.clinica
    ADD CONSTRAINT clinica_usuario_id_key UNIQUE (usuario_id);


--
-- Name: detalle_pedido detalle_pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT detalle_pedido_pkey PRIMARY KEY (id);


--
-- Name: disponibilidad_bloqueo disponibilidad_bloqueo_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.disponibilidad_bloqueo
    ADD CONSTRAINT disponibilidad_bloqueo_pkey PRIMARY KEY (id);


--
-- Name: doctor_clinica doctor_clinica_doctor_id_clinica_id_key; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.doctor_clinica
    ADD CONSTRAINT doctor_clinica_doctor_id_clinica_id_key UNIQUE (doctor_id, clinica_id);


--
-- Name: doctor_clinica doctor_clinica_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.doctor_clinica
    ADD CONSTRAINT doctor_clinica_pkey PRIMARY KEY (id);


--
-- Name: doctor_especialidad doctor_especialidad_doctor_id_especialidad_id_key; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.doctor_especialidad
    ADD CONSTRAINT doctor_especialidad_doctor_id_especialidad_id_key UNIQUE (doctor_id, especialidad_id);


--
-- Name: doctor_especialidad doctor_especialidad_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.doctor_especialidad
    ADD CONSTRAINT doctor_especialidad_pkey PRIMARY KEY (id);


--
-- Name: doctor_perfil_extra doctor_perfil_extra_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.doctor_perfil_extra
    ADD CONSTRAINT doctor_perfil_extra_pkey PRIMARY KEY (doctor_id);


--
-- Name: doctor doctor_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_pkey PRIMARY KEY (id);


--
-- Name: doctor doctor_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_usuario_id_key UNIQUE (usuario_id);


--
-- Name: educacion_doctor educacion_doctor_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.educacion_doctor
    ADD CONSTRAINT educacion_doctor_pkey PRIMARY KEY (id);


--
-- Name: especialidad especialidad_nombre_key; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.especialidad
    ADD CONSTRAINT especialidad_nombre_key UNIQUE (nombre);


--
-- Name: especialidad especialidad_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.especialidad
    ADD CONSTRAINT especialidad_pkey PRIMARY KEY (id);


--
-- Name: experiencia_doctor experiencia_doctor_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.experiencia_doctor
    ADD CONSTRAINT experiencia_doctor_pkey PRIMARY KEY (id);


--
-- Name: galeria_clinica galeria_clinica_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.galeria_clinica
    ADD CONSTRAINT galeria_clinica_pkey PRIMARY KEY (id);


--
-- Name: horario_atencion horario_atencion_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.horario_atencion
    ADD CONSTRAINT horario_atencion_pkey PRIMARY KEY (id);


--
-- Name: lugar_atencion lugar_atencion_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.lugar_atencion
    ADD CONSTRAINT lugar_atencion_pkey PRIMARY KEY (id);


--
-- Name: paciente_doctor_reciente paciente_doctor_reciente_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.paciente_doctor_reciente
    ADD CONSTRAINT paciente_doctor_reciente_pkey PRIMARY KEY (id);


--
-- Name: paciente paciente_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_pkey PRIMARY KEY (id);


--
-- Name: paciente paciente_usuario_id_key; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_usuario_id_key UNIQUE (usuario_id);


--
-- Name: pedido pedido_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.pedido
    ADD CONSTRAINT pedido_pkey PRIMARY KEY (id);


--
-- Name: producto producto_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (id);


--
-- Name: review review_cita_id_key; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_cita_id_key UNIQUE (cita_id);


--
-- Name: review review_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_pkey PRIMARY KEY (id);


--
-- Name: servicio servicio_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_pkey PRIMARY KEY (id);


--
-- Name: paciente_doctor_reciente uq_paciente_doctor_reciente; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.paciente_doctor_reciente
    ADD CONSTRAINT uq_paciente_doctor_reciente UNIQUE (paciente_id, doctor_id);


--
-- Name: usuario usuario_email_key; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_email_key UNIQUE (email);


--
-- Name: usuario usuario_pkey; Type: CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.usuario
    ADD CONSTRAINT usuario_pkey PRIMARY KEY (id);


--
-- Name: idx_bloqueo_doctor; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_bloqueo_doctor ON public.disponibilidad_bloqueo USING btree (doctor_id);


--
-- Name: idx_bloqueo_fecha; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_bloqueo_fecha ON public.disponibilidad_bloqueo USING btree (fecha);


--
-- Name: idx_bloqueo_lugar; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_bloqueo_lugar ON public.disponibilidad_bloqueo USING btree (lugar_atencion_id);


--
-- Name: idx_cita_clinica; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_cita_clinica ON public.cita USING btree (clinica_id);


--
-- Name: idx_cita_doctor; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_cita_doctor ON public.cita USING btree (doctor_id);


--
-- Name: idx_cita_estado; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_cita_estado ON public.cita USING btree (estado);


--
-- Name: idx_cita_fecha; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_cita_fecha ON public.cita USING btree (fecha);


--
-- Name: idx_cita_lugar; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_cita_lugar ON public.cita USING btree (lugar_atencion_id);


--
-- Name: idx_cita_paciente; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_cita_paciente ON public.cita USING btree (paciente_id);


--
-- Name: idx_cita_servicio; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_cita_servicio ON public.cita USING btree (servicio_id);


--
-- Name: idx_clinica_ciudad; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_clinica_ciudad ON public.clinica USING btree (ciudad);


--
-- Name: idx_clinica_especialidad_clinica; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_clinica_especialidad_clinica ON public.clinica_especialidad USING btree (clinica_id);


--
-- Name: idx_clinica_especialidad_especialidad; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_clinica_especialidad_especialidad ON public.clinica_especialidad USING btree (especialidad_id);


--
-- Name: idx_clinica_lat_lng; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_clinica_lat_lng ON public.clinica USING btree (latitud, longitud);


--
-- Name: idx_clinica_usuario; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_clinica_usuario ON public.clinica USING btree (usuario_id);


--
-- Name: idx_clinica_verificada; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_clinica_verificada ON public.clinica USING btree (verificada);


--
-- Name: idx_doctor_clinica_activo; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_doctor_clinica_activo ON public.doctor_clinica USING btree (activo);


--
-- Name: idx_doctor_clinica_clinica; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_doctor_clinica_clinica ON public.doctor_clinica USING btree (clinica_id);


--
-- Name: idx_doctor_clinica_doctor; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_doctor_clinica_doctor ON public.doctor_clinica USING btree (doctor_id);


--
-- Name: idx_doctor_especialidad_doctor; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_doctor_especialidad_doctor ON public.doctor_especialidad USING btree (doctor_id);


--
-- Name: idx_doctor_especialidad_especialidad; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_doctor_especialidad_especialidad ON public.doctor_especialidad USING btree (especialidad_id);


--
-- Name: idx_doctor_usuario; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_doctor_usuario ON public.doctor USING btree (usuario_id);


--
-- Name: idx_doctor_verificado; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_doctor_verificado ON public.doctor USING btree (verificado);


--
-- Name: idx_horario_activo; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_horario_activo ON public.horario_atencion USING btree (activo);


--
-- Name: idx_horario_dia; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_horario_dia ON public.horario_atencion USING btree (dia_semana);


--
-- Name: idx_horario_doctor; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_horario_doctor ON public.horario_atencion USING btree (doctor_id);


--
-- Name: idx_horario_lugar; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_horario_lugar ON public.horario_atencion USING btree (lugar_atencion_id);


--
-- Name: idx_lugar_atencion_activo; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_lugar_atencion_activo ON public.lugar_atencion USING btree (activo);


--
-- Name: idx_lugar_atencion_ciudad; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_lugar_atencion_ciudad ON public.lugar_atencion USING btree (ciudad);


--
-- Name: idx_lugar_atencion_clinica; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_lugar_atencion_clinica ON public.lugar_atencion USING btree (clinica_id);


--
-- Name: idx_lugar_atencion_doctor; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_lugar_atencion_doctor ON public.lugar_atencion USING btree (doctor_id);


--
-- Name: idx_lugar_atencion_tipo; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_lugar_atencion_tipo ON public.lugar_atencion USING btree (tipo_lugar);


--
-- Name: idx_paciente_doctor_reciente_paciente_visto; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_paciente_doctor_reciente_paciente_visto ON public.paciente_doctor_reciente USING btree (paciente_id, visto_en DESC);


--
-- Name: idx_paciente_usuario; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_paciente_usuario ON public.paciente USING btree (usuario_id);


--
-- Name: idx_review_clinica; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_review_clinica ON public.review USING btree (clinica_id);


--
-- Name: idx_review_doctor; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_review_doctor ON public.review USING btree (doctor_id);


--
-- Name: idx_review_paciente; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_review_paciente ON public.review USING btree (paciente_id);


--
-- Name: idx_servicio_activo; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_servicio_activo ON public.servicio USING btree (activo);


--
-- Name: idx_servicio_clinica; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_servicio_clinica ON public.servicio USING btree (clinica_id);


--
-- Name: idx_servicio_doctor; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_servicio_doctor ON public.servicio USING btree (doctor_id);


--
-- Name: idx_servicio_lugar; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_servicio_lugar ON public.servicio USING btree (lugar_atencion_id);


--
-- Name: idx_usuario_email; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_usuario_email ON public.usuario USING btree (email);


--
-- Name: idx_usuario_estado; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_usuario_estado ON public.usuario USING btree (estado);


--
-- Name: idx_usuario_rol; Type: INDEX; Schema: public; Owner: baxava
--

CREATE INDEX idx_usuario_rol ON public.usuario USING btree (rol);


--
-- Name: uq_cita_doctor_horario_activa; Type: INDEX; Schema: public; Owner: baxava
--

CREATE UNIQUE INDEX uq_cita_doctor_horario_activa ON public.cita USING btree (doctor_id, fecha, hora_inicio, hora_fin) WHERE (estado = ANY (ARRAY['pendiente'::public.estado_cita, 'confirmada'::public.estado_cita]));


--
-- Name: cita cita_clinica_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.clinica(id) ON DELETE SET NULL;


--
-- Name: cita cita_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON DELETE CASCADE;


--
-- Name: cita cita_lugar_atencion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_lugar_atencion_id_fkey FOREIGN KEY (lugar_atencion_id) REFERENCES public.lugar_atencion(id) ON DELETE RESTRICT;


--
-- Name: cita cita_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.paciente(id) ON DELETE CASCADE;


--
-- Name: cita cita_servicio_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.cita
    ADD CONSTRAINT cita_servicio_id_fkey FOREIGN KEY (servicio_id) REFERENCES public.servicio(id) ON DELETE SET NULL;


--
-- Name: clinica_especialidad clinica_especialidad_clinica_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.clinica_especialidad
    ADD CONSTRAINT clinica_especialidad_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.clinica(id) ON DELETE CASCADE;


--
-- Name: clinica_especialidad clinica_especialidad_especialidad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.clinica_especialidad
    ADD CONSTRAINT clinica_especialidad_especialidad_id_fkey FOREIGN KEY (especialidad_id) REFERENCES public.especialidad(id) ON DELETE CASCADE;


--
-- Name: clinica clinica_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.clinica
    ADD CONSTRAINT clinica_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: disponibilidad_bloqueo disponibilidad_bloqueo_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.disponibilidad_bloqueo
    ADD CONSTRAINT disponibilidad_bloqueo_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON DELETE CASCADE;


--
-- Name: disponibilidad_bloqueo disponibilidad_bloqueo_lugar_atencion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.disponibilidad_bloqueo
    ADD CONSTRAINT disponibilidad_bloqueo_lugar_atencion_id_fkey FOREIGN KEY (lugar_atencion_id) REFERENCES public.lugar_atencion(id) ON DELETE CASCADE;


--
-- Name: doctor_clinica doctor_clinica_clinica_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.doctor_clinica
    ADD CONSTRAINT doctor_clinica_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.clinica(id) ON DELETE CASCADE;


--
-- Name: doctor_clinica doctor_clinica_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.doctor_clinica
    ADD CONSTRAINT doctor_clinica_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON DELETE CASCADE;


--
-- Name: doctor_especialidad doctor_especialidad_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.doctor_especialidad
    ADD CONSTRAINT doctor_especialidad_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON DELETE CASCADE;


--
-- Name: doctor_especialidad doctor_especialidad_especialidad_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.doctor_especialidad
    ADD CONSTRAINT doctor_especialidad_especialidad_id_fkey FOREIGN KEY (especialidad_id) REFERENCES public.especialidad(id) ON DELETE CASCADE;


--
-- Name: doctor_perfil_extra doctor_perfil_extra_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.doctor_perfil_extra
    ADD CONSTRAINT doctor_perfil_extra_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id);


--
-- Name: doctor doctor_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: educacion_doctor educacion_doctor_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.educacion_doctor
    ADD CONSTRAINT educacion_doctor_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON DELETE CASCADE;


--
-- Name: experiencia_doctor experiencia_doctor_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.experiencia_doctor
    ADD CONSTRAINT experiencia_doctor_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON DELETE CASCADE;


--
-- Name: detalle_pedido fk_detalle_pedido; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT fk_detalle_pedido FOREIGN KEY (pedido_id) REFERENCES public.pedido(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: detalle_pedido fk_detalle_producto; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.detalle_pedido
    ADD CONSTRAINT fk_detalle_producto FOREIGN KEY (producto_id) REFERENCES public.producto(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: producto fk_producto_categoria; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT fk_producto_categoria FOREIGN KEY (categoria_id) REFERENCES public.categoria(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: galeria_clinica galeria_clinica_clinica_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.galeria_clinica
    ADD CONSTRAINT galeria_clinica_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.clinica(id) ON DELETE CASCADE;


--
-- Name: horario_atencion horario_atencion_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.horario_atencion
    ADD CONSTRAINT horario_atencion_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON DELETE CASCADE;


--
-- Name: horario_atencion horario_atencion_lugar_atencion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.horario_atencion
    ADD CONSTRAINT horario_atencion_lugar_atencion_id_fkey FOREIGN KEY (lugar_atencion_id) REFERENCES public.lugar_atencion(id) ON DELETE CASCADE;


--
-- Name: lugar_atencion lugar_atencion_clinica_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.lugar_atencion
    ADD CONSTRAINT lugar_atencion_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.clinica(id) ON DELETE CASCADE;


--
-- Name: lugar_atencion lugar_atencion_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.lugar_atencion
    ADD CONSTRAINT lugar_atencion_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON DELETE CASCADE;


--
-- Name: paciente_doctor_reciente paciente_doctor_reciente_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.paciente_doctor_reciente
    ADD CONSTRAINT paciente_doctor_reciente_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id);


--
-- Name: paciente_doctor_reciente paciente_doctor_reciente_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.paciente_doctor_reciente
    ADD CONSTRAINT paciente_doctor_reciente_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.paciente(id);


--
-- Name: paciente paciente_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.paciente
    ADD CONSTRAINT paciente_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuario(id) ON DELETE CASCADE;


--
-- Name: review review_cita_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_cita_id_fkey FOREIGN KEY (cita_id) REFERENCES public.cita(id) ON DELETE CASCADE;


--
-- Name: review review_clinica_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.clinica(id) ON DELETE CASCADE;


--
-- Name: review review_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON DELETE CASCADE;


--
-- Name: review review_paciente_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.review
    ADD CONSTRAINT review_paciente_id_fkey FOREIGN KEY (paciente_id) REFERENCES public.paciente(id) ON DELETE CASCADE;


--
-- Name: servicio servicio_clinica_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_clinica_id_fkey FOREIGN KEY (clinica_id) REFERENCES public.clinica(id) ON DELETE CASCADE;


--
-- Name: servicio servicio_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(id) ON DELETE CASCADE;


--
-- Name: servicio servicio_lugar_atencion_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: baxava
--

ALTER TABLE ONLY public.servicio
    ADD CONSTRAINT servicio_lugar_atencion_id_fkey FOREIGN KEY (lugar_atencion_id) REFERENCES public.lugar_atencion(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict UAIEWFIvTPqTd7n94agRoZLGcgB9cYQu677LvlxS4uwUo1rQNt3r2shdtbA5jJb

