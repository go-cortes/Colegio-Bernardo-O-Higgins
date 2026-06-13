INSERT INTO anotaciones (estudiante_id, profesor_id, tipo, descripcion, medida, fecha_registro) VALUES
(3, 1, 'NEGATIVA',    'El alumno interrumpió la clase en repetidas ocasiones.',         'Se contactará al apoderado.',      NOW()),
(3, 1, 'POSITIVA',    'Participó activamente y ayudó a sus compañeros en matemáticas.', NULL,                               NOW()),
(4, 1, 'INFORMATIVA', 'El apoderado informó que el alumno tiene cita médica mañana.',   NULL,                               NOW()),
(5, 1, 'NEGATIVA',    'No trajo el material solicitado por tercera vez consecutiva.',   'Amonestación verbal registrada.', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO asistencias (estudiante_id, fecha, estado, observacion) VALUES
(3, CURRENT_DATE, 'PRESENTE',  NULL),
(4, CURRENT_DATE, 'TARDANZA',  'Llegó 15 minutos tarde sin justificación.'),
(5, CURRENT_DATE, 'PRESENTE',  NULL),
(6, CURRENT_DATE, 'AUSENTE',   NULL),
(7, CURRENT_DATE, 'JUSTIFICADO', 'Cita médica presentada por apoderado.')
ON CONFLICT DO NOTHING;
