INSERT INTO usuarios (nombre, email, rol, curso) VALUES
('Juan Pérez',      'profesor@colegio.cl',   'PROFESOR', '4° Medio A'),
('María Soto',      'maria@colegio.cl',      'PROFESOR', '3° Medio B'),
('Ana Gómez',       'alumno@colegio.cl',     'ALUMNO',   '4° Medio A'),
('Carlos Ruiz',     'carlos@colegio.cl',     'ALUMNO',   '4° Medio A'),
('Sofía Castillo',  'sofia@colegio.cl',      'ALUMNO',   '4° Medio A'),
('Benjamín Pérez',  'benjamin@colegio.cl',   'ALUMNO',   '3° Medio B'),
('Martina Rodríguez','martina@colegio.cl',   'ALUMNO',   '3° Medio B')
ON CONFLICT DO NOTHING;
