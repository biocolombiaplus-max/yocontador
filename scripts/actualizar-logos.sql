-- Asigna los logos reales de cada empresa (ya subidos a /public/logos en el
-- despliegue) para que se vean en el panel y en la landing publica.
-- Pega este script completo en el Editor SQL de Neon y ejecutalo una sola vez.

UPDATE "Company" SET "logoUrl" = '/logos/biosoft.png' WHERE slug = 'biosoft';
UPDATE "Company" SET "logoUrl" = '/logos/biofutbol.png' WHERE slug = 'biofutbol';
UPDATE "Company" SET "logoUrl" = '/logos/biomarketing.png' WHERE slug = 'biomarketing';
UPDATE "Company" SET "logoUrl" = '/logos/biosalud.png' WHERE slug = 'biosalud';
