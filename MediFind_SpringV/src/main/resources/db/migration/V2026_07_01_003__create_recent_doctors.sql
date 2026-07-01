CREATE TABLE IF NOT EXISTS paciente_doctor_reciente (
    id uuid PRIMARY KEY,
    paciente_id uuid NOT NULL REFERENCES paciente(id),
    doctor_id uuid NOT NULL REFERENCES doctor(id),
    visto_en timestamp without time zone NOT NULL DEFAULT now(),
    CONSTRAINT uq_paciente_doctor_reciente UNIQUE (paciente_id, doctor_id)
);

CREATE INDEX IF NOT EXISTS idx_paciente_doctor_reciente_paciente_visto
ON paciente_doctor_reciente (paciente_id, visto_en DESC);
