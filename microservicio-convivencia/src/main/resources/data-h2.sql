INSERT INTO anotaciones (estudiante_id, profesor_id, tipo, descripcion, medida, fecha_registro) VALUES
(3, 1, 'NEGATIVA',    'El alumno interrumpió la clase en repetidas ocasiones.',         'Se contactará al apoderado.',      CURRENT_TIMESTAMP()),
(3, 1, 'POSITIVA',    'Participó activamente y ayudó a sus compañeros en matemáticas.', NULL,                               CURRENT_TIMESTAMP()),
(4, 1, 'INFORMATIVA', 'El apoderado informó que el alumno tiene cita médica mañana.',   NULL,                               CURRENT_TIMESTAMP()),
(5, 1, 'NEGATIVA',    'No trajo el material solicitado por tercera vez consecutiva.',   'Amonestación verbal registrada.', CURRENT_TIMESTAMP());

INSERT INTO asistencias (estudiante_id, fecha, estado, observacion) VALUES
(3, CURRENT_DATE(), 'PRESENTE',  NULL),
(4, CURRENT_DATE(), 'TARDANZA',  'Llegó 15 minutos tarde sin justificación.'),
(5, CURRENT_DATE(), 'PRESENTE',  NULL),
(6, CURRENT_DATE(), 'AUSENTE',   NULL),
(7, CURRENT_DATE(), 'JUSTIFICADO', 'Cita médica presentada por apoderado.');
