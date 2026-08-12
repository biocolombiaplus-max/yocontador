-- Corrige el link de "Ver demo" de Biosoft (el anterior apuntaba a
-- landing.html; el demo real de la app es app.html).
-- Pega este script en el Editor SQL de Neon y ejecutalo una sola vez.

UPDATE "Company" SET "website" = 'https://bioauditoria.com/biosoft/app.html' WHERE slug = 'biosoft';
