INSERT INTO usuarios (nombre, email, rol) VALUES
('Juan Pérez',      'profesor@colegio.cl',   'PROFESOR'),
('María Soto',      'maria@colegio.cl',      'PROFESOR'),
('Ana Gómez',       'alumno@colegio.cl',     'ALUMNO'),
('Carlos Ruiz',     'carlos@colegio.cl',     'ALUMNO'),
('Sofía Castillo',  'sofia@colegio.cl',      'ALUMNO'),
('Benjamín Pérez',  'benjamin@colegio.cl',   'ALUMNO'),
('Martina Rodríguez','martina@colegio.cl',   'ALUMNO')
ON CONFLICT DO NOTHING;
