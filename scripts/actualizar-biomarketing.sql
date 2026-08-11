-- Biomarketing no es solo para el sector salud: es la agencia de marketing
-- digital del grupo para cualquier tipo de empresa o emprendimiento.
-- Pega este script en el Editor SQL de Neon y ejecutalo una sola vez.

UPDATE "Company"
SET
  "sector" = 'Agencia de marketing digital y redes sociales',
  "description" = 'Agencia de marketing digital para cualquier tipo de empresa o emprendimiento: gestionamos tus redes sociales y estrategia de contenido con el objetivo de aumentar tus ventas de productos o servicios, apoyados en Inteligencia Artificial.'
WHERE slug = 'biomarketing';
