-- Script combinado con TODO lo pendiente en produccion hasta ahora:
-- 1) logos de las empresas, 2) Bio Contador + Bio Finanzas + los 4 planes
-- reales de redes sociales (oculta el plan viejo de $600.000),
-- 3) Biomarketing como agencia general (no solo salud).
-- Pega este script completo en el Editor SQL de Neon (Neon → tu proyecto →
-- SQL Editor) y ejecutalo una sola vez. Es seguro volver a correrlo si algo
-- falla a la mitad: no duplica ni borra nada.

-- ===== 1. Logos de las 4 empresas originales =====
UPDATE "Company" SET "logoUrl" = '/logos/biosoft.png' WHERE slug = 'biosoft';
UPDATE "Company" SET "logoUrl" = '/logos/biofutbol.png' WHERE slug = 'biofutbol';
UPDATE "Company" SET "logoUrl" = '/logos/biomarketing.png' WHERE slug = 'biomarketing';
UPDATE "Company" SET "logoUrl" = '/logos/biosalud.png' WHERE slug = 'biosalud';

-- ===== 2. Bio Contador, Bio Finanzas y los 4 planes reales de redes =====

-- Columna nueva que necesita el catalogo de servicios
ALTER TABLE "ServiceOffering" ADD COLUMN IF NOT EXISTS "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- Empresas nuevas
INSERT INTO "Company" (id, name, slug, sector, description, "colorHex", "logoUrl", "website", "isActive", "order", "createdAt", "updatedAt")
VALUES
  ('cmp_biocontador', 'Bio Contador', 'biocontador', 'Software y app - Declaracion de renta', 'Software y app web para elaborar declaraciones de renta con Inteligencia Artificial, con el respaldo real de una contadora certificada detras de cada proceso, para personas naturales y para contadores que quieran digitalizar su propia gestion con clientes.', '#F59E0B', '/logos/biocontador.png', 'https://biocolombiaplus-max.github.io/yocontador', true, 4, now(), now()),
  ('cmp_biofinanzas', 'Bio Finanzas', 'biofinanzas', 'Plataforma - Recuperacion de cartera', 'Plataforma tecnologica para que entidades financieras y empresas con cartera pendiente gestionen con Inteligencia Artificial la recuperacion de cartera y el proceso comercial de sus asesores, con ranking en vivo y campanas de remarketing.', '#0891B2', '/logos/biofinanzas.jpg', 'https://biocolombiaplus-max.github.io/biofinanzas/', true, 5, now(), now())
ON CONFLICT (slug) DO NOTHING;

-- Link de demo de Biosoft (si no lo tenia)
UPDATE "Company" SET "website" = 'https://bioauditoria.com/biosoft/landing.html' WHERE slug = 'biosoft' AND "website" IS NULL;

-- Cuentas de redes sociales (pendientes de conectar) para las 2 empresas nuevas
INSERT INTO "SocialAccount" (id, "companyId", platform, handle, status, followers, "createdAt", "updatedAt")
VALUES
  ('sa_biocontador_fb', 'cmp_biocontador', 'FACEBOOK', '@biocontador', 'PENDIENTE', 0, now(), now()),
  ('sa_biocontador_ig', 'cmp_biocontador', 'INSTAGRAM', '@biocontador', 'PENDIENTE', 0, now(), now()),
  ('sa_biocontador_wa', 'cmp_biocontador', 'WHATSAPP', '@biocontador', 'PENDIENTE', 0, now(), now()),
  ('sa_biocontador_tt', 'cmp_biocontador', 'TIKTOK', '@biocontador', 'PENDIENTE', 0, now(), now()),
  ('sa_biofinanzas_fb', 'cmp_biofinanzas', 'FACEBOOK', '@biofinanzas', 'PENDIENTE', 0, now(), now()),
  ('sa_biofinanzas_ig', 'cmp_biofinanzas', 'INSTAGRAM', '@biofinanzas', 'PENDIENTE', 0, now(), now()),
  ('sa_biofinanzas_wa', 'cmp_biofinanzas', 'WHATSAPP', '@biofinanzas', 'PENDIENTE', 0, now(), now()),
  ('sa_biofinanzas_tt', 'cmp_biofinanzas', 'TIKTOK', '@biofinanzas', 'PENDIENTE', 0, now(), now())
ON CONFLICT ("companyId", platform) DO NOTHING;

-- Oculta el plan generico viejo de $600.000 (no se borra, solo deja de mostrarse)
UPDATE "ServiceOffering" SET "isActive" = false, "isPublished" = false
WHERE slug = 'gestion-redes-sociales';

-- Los 4 planes reales de gestion de redes sociales
INSERT INTO "ServiceOffering" (id, name, slug, "shortDescription", description, "colorHex", "defaultPriceCOP", "defaultPeriod", "reconnectionFeeCOP", "isFeatured", "isActive", "isPublished", "order", "createdAt", "updatedAt")
VALUES
  ('svc_redes_emprendedor', 'Redes sociales - Emprendedor', 'redes-emprendedor', 'Para emprendedores y negocios que estan arrancando en redes y quieren una base solida sin gastar de mas.', E'Analisis de nicho y optimizacion de perfil (Instagram y Facebook)\n2 reels mensuales\n8 imagenes de producto o servicio con apoyo de IA', '#7C3AED', 350000, 'MENSUAL', 50000, false, true, true, 4, now(), now()),
  ('svc_redes_basico', 'Redes sociales - Basico', 'redes-basico', 'Para negocios que quieren dejar de publicar sin rumbo y empezar a tener una estrategia real.', E'Analisis de nicho y optimizacion de perfil\n1 red social (Instagram o Facebook)\n8 piezas de diseno al mes\nCalendario de contenido con estrategia mensual\nReporte mensual de resultados', '#7C3AED', 690000, 'MENSUAL', 50000, false, true, true, 5, now(), now()),
  ('svc_redes_intermedio', 'Redes sociales - Intermedio', 'redes-intermedio', 'Para marcas que quieren crecer de forma constante y convertir seguidores en clientes reales.', E'Analisis de nicho y optimizacion de perfil a fondo\n2 redes sociales (Instagram + Facebook)\n16 piezas de diseno + 4 reels al mes\nEstrategia de contenido con IA y analitica de datos\nCommunity management de comentarios y mensajes\nPauta publicitaria gestionada (inversion aparte)\nReporte mensual con metricas de crecimiento', '#F97316', 1290000, 'MENSUAL', 50000, true, true, true, 6, now(), now()),
  ('svc_redes_empresarial', 'Redes sociales - Empresarial', 'redes-empresarial', 'Para empresas y grupos con varias sedes, marcas o lineas de negocio que necesitan una estrategia a la medida.', E'Redes ilimitadas (Instagram, Facebook, TikTok, WhatsApp Business)\nProduccion fotografica y de video profesional\nEstrategia y pauta avanzada con IA y analitica de datos\nGestor de cuenta dedicado\nReportes personalizados por marca o sede', '#DB2777', 0, 'MENSUAL', 50000, false, true, true, 7, now(), now())
ON CONFLICT (slug) DO NOTHING;

-- ===== 3. Biomarketing como agencia general (no solo salud) =====
UPDATE "Company"
SET
  "sector" = 'Agencia de marketing digital y redes sociales',
  "description" = 'Agencia de marketing digital para cualquier tipo de empresa o emprendimiento: gestionamos tus redes sociales y estrategia de contenido con el objetivo de aumentar tus ventas de productos o servicios, apoyados en Inteligencia Artificial.'
WHERE slug = 'biomarketing';
