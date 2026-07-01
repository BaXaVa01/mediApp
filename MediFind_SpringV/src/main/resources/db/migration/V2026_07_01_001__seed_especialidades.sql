INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111101'::uuid, 'Medicina General', 'Atención médica integral para diagnóstico, tratamiento y prevención de enfermedades comunes.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Medicina General'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111102'::uuid, 'Cardiología', 'Especialidad enfocada en el diagnóstico y tratamiento de enfermedades del corazón y sistema cardiovascular.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Cardiología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111103'::uuid, 'Dermatología', 'Atención de enfermedades de la piel, cabello, uñas y condiciones dermatológicas.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Dermatología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111104'::uuid, 'Pediatría', 'Atención médica para niños, niñas y adolescentes.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Pediatría'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111105'::uuid, 'Ginecología y Obstetricia', 'Atención de salud femenina, embarazo, parto y sistema reproductivo.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Ginecología y Obstetricia'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111106'::uuid, 'Medicina Interna', 'Diagnóstico y manejo integral de enfermedades en adultos.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Medicina Interna'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111107'::uuid, 'Ortopedia y Traumatología', 'Diagnóstico y tratamiento de lesiones óseas, articulares, musculares y traumáticas.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Ortopedia y Traumatología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111108'::uuid, 'Neurología', 'Atención de enfermedades del sistema nervioso, cerebro, médula espinal y nervios.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Neurología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111109'::uuid, 'Psiquiatría', 'Diagnóstico y tratamiento médico de trastornos mentales y emocionales.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Psiquiatría'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111110'::uuid, 'Psicología', 'Evaluación y acompañamiento psicológico para bienestar emocional y salud mental.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Psicología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111111'::uuid, 'Oftalmología', 'Diagnóstico y tratamiento de enfermedades de los ojos y salud visual.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Oftalmología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111112'::uuid, 'Otorrinolaringología', 'Atención de oído, nariz, garganta y estructuras relacionadas.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Otorrinolaringología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111113'::uuid, 'Urología', 'Diagnóstico y tratamiento de enfermedades del sistema urinario y salud masculina.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Urología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111114'::uuid, 'Gastroenterología', 'Atención de enfermedades del sistema digestivo.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Gastroenterología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111115'::uuid, 'Endocrinología', 'Diagnóstico y tratamiento de trastornos hormonales y metabólicos.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Endocrinología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111116'::uuid, 'Neumología', 'Atención de enfermedades respiratorias y pulmonares.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Neumología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111117'::uuid, 'Reumatología', 'Diagnóstico y tratamiento de enfermedades articulares, autoinmunes y reumáticas.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Reumatología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111118'::uuid, 'Nefrología', 'Atención de enfermedades renales y del sistema urinario relacionadas con el riñón.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Nefrología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111119'::uuid, 'Oncología', 'Diagnóstico y tratamiento de enfermedades oncológicas.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Oncología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111120'::uuid, 'Cirugía General', 'Evaluación y tratamiento quirúrgico de enfermedades comunes.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Cirugía General'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111121'::uuid, 'Cirugía Plástica', 'Procedimientos reconstructivos y estéticos.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Cirugía Plástica'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111122'::uuid, 'Medicina Familiar', 'Atención integral y continua para personas y familias.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Medicina Familiar'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111123'::uuid, 'Nutrición', 'Evaluación y orientación alimentaria para mejorar la salud y prevenir enfermedades.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Nutrición'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111124'::uuid, 'Odontología', 'Atención de salud bucal, dientes, encías y estructuras relacionadas.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Odontología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111125'::uuid, 'Fisioterapia', 'Rehabilitación física, movilidad, dolor y recuperación funcional.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Fisioterapia'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111126'::uuid, 'Radiología', 'Diagnóstico por imágenes médicas.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Radiología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111127'::uuid, 'Anestesiología', 'Manejo anestésico, dolor y cuidado perioperatorio.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Anestesiología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111128'::uuid, 'Alergología', 'Diagnóstico y tratamiento de alergias y trastornos inmunológicos relacionados.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Alergología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111129'::uuid, 'Infectología', 'Diagnóstico y tratamiento de enfermedades infecciosas.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Infectología'));

INSERT INTO especialidad (id, nombre, descripcion)
SELECT '11111111-1111-1111-1111-111111111130'::uuid, 'Hematología', 'Diagnóstico y tratamiento de enfermedades de la sangre.'
WHERE NOT EXISTS (SELECT 1 FROM especialidad WHERE LOWER(nombre) = LOWER('Hematología'));
