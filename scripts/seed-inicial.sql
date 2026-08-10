-- Datos iniciales reales para BIO COLOMBIA (sin datos de prueba/ficticios).
-- Pega este script completo en el Editor SQL de Neon y ejecutalo una sola vez.

-- 1. Usuarios (Juan Carlos y Nicol). Contrasena temporal = su cedula,
--    se les pedira cambiarla en el primer ingreso.
INSERT INTO "User" (id, cedula, name, role, "passwordHash", "mustChangePassword", "avatarColor", "createdAt", "updatedAt")
VALUES
  ('usr_juancarlos', '88262856', 'Juan Carlos Caceres', 'PROPIETARIO', '$2b$10$.w7qrsPqE8XzYjdBUGQYCut4lHKZVCAjOKgCViWpBYXkSGHF/TXNq', true, '#0EA5A4', now(), now()),
  ('usr_nicol', '1127052812', 'Nicol Bustos', 'ADMINISTRADORA', '$2b$10$rO2xXEgKGihX/xMwe4tLMeE.gtBPqHXJPBslW2NjkZBDQ5NAWlJUK', true, '#DB2777', now(), now())
ON CONFLICT (cedula) DO NOTHING;

-- 2. Empresas del grupo
INSERT INTO "Company" (id, name, slug, sector, description, "colorHex", "isActive", "order", "createdAt", "updatedAt")
VALUES
  ('cmp_biosoft', 'Biosoft', 'biosoft', 'Software para laboratorio clinico', 'Software especializado para la gestion integral de laboratorios clinicos: ordenes, resultados, facturacion e interoperabilidad.', '#0EA5A4', true, 0, now(), now()),
  ('cmp_biofutbol', 'BioFutbol', 'biofutbol', 'Tecnologia deportiva con IA', 'Aplicacion con inteligencia artificial para la administracion de clubes y escuelas de futbol: jugadores, entrenamientos y desempeno.', '#16A34A', true, 1, now(), now()),
  ('cmp_biomarketing', 'Biomarketing', 'biomarketing', 'Marketing digital para salud', 'Agencia especialista en aumentar ventas y captacion de pacientes para negocios del sector salud.', '#DB2777', true, 2, now(), now()),
  ('cmp_biosalud', 'Biosalud', 'biosalud', 'Equipos medicos y de laboratorio', 'Venta de equipos medicos, de laboratorio y de rayos X, y soluciones integrales para el sector salud.', '#2563EB', true, 3, now(), now())
ON CONFLICT (slug) DO NOTHING;

-- 3. Cuentas de redes sociales (pendientes de conectar) para cada empresa
INSERT INTO "SocialAccount" (id, "companyId", platform, handle, status, followers, "createdAt", "updatedAt")
VALUES
  ('sa_biosoft_fb', 'cmp_biosoft', 'FACEBOOK', '@biosoft', 'PENDIENTE', 0, now(), now()),
  ('sa_biosoft_ig', 'cmp_biosoft', 'INSTAGRAM', '@biosoft', 'PENDIENTE', 0, now(), now()),
  ('sa_biosoft_wa', 'cmp_biosoft', 'WHATSAPP', '@biosoft', 'PENDIENTE', 0, now(), now()),
  ('sa_biosoft_tt', 'cmp_biosoft', 'TIKTOK', '@biosoft', 'PENDIENTE', 0, now(), now()),
  ('sa_biofutbol_fb', 'cmp_biofutbol', 'FACEBOOK', '@biofutbol', 'PENDIENTE', 0, now(), now()),
  ('sa_biofutbol_ig', 'cmp_biofutbol', 'INSTAGRAM', '@biofutbol', 'PENDIENTE', 0, now(), now()),
  ('sa_biofutbol_wa', 'cmp_biofutbol', 'WHATSAPP', '@biofutbol', 'PENDIENTE', 0, now(), now()),
  ('sa_biofutbol_tt', 'cmp_biofutbol', 'TIKTOK', '@biofutbol', 'PENDIENTE', 0, now(), now()),
  ('sa_biomarketing_fb', 'cmp_biomarketing', 'FACEBOOK', '@biomarketing', 'PENDIENTE', 0, now(), now()),
  ('sa_biomarketing_ig', 'cmp_biomarketing', 'INSTAGRAM', '@biomarketing', 'PENDIENTE', 0, now(), now()),
  ('sa_biomarketing_wa', 'cmp_biomarketing', 'WHATSAPP', '@biomarketing', 'PENDIENTE', 0, now(), now()),
  ('sa_biomarketing_tt', 'cmp_biomarketing', 'TIKTOK', '@biomarketing', 'PENDIENTE', 0, now(), now()),
  ('sa_biosalud_fb', 'cmp_biosalud', 'FACEBOOK', '@biosalud', 'PENDIENTE', 0, now(), now()),
  ('sa_biosalud_ig', 'cmp_biosalud', 'INSTAGRAM', '@biosalud', 'PENDIENTE', 0, now(), now()),
  ('sa_biosalud_wa', 'cmp_biosalud', 'WHATSAPP', '@biosalud', 'PENDIENTE', 0, now(), now()),
  ('sa_biosalud_tt', 'cmp_biosalud', 'TIKTOK', '@biosalud', 'PENDIENTE', 0, now(), now())
ON CONFLICT ("companyId", platform) DO NOTHING;

-- 4. Catalogo de servicios
INSERT INTO "ServiceOffering" (id, name, slug, "shortDescription", description, "colorHex", "defaultPriceCOP", "defaultPeriod", "reconnectionFeeCOP", "isActive", "isPublished", "order", "createdAt", "updatedAt")
VALUES
  ('svc_whatsapp_ia', 'Automatizacion WhatsApp + IA', 'automatizacion-whatsapp-ia', 'CRM y remarketing por WhatsApp con inteligencia artificial.', 'Un CRM completo para gestionar tus contactos y ventas, con automatizacion de mensajes y remarketing por WhatsApp asistido por inteligencia artificial. Ideal para negocios que quieren responder rapido y no perder ni un cliente.', '#25D366', 450000, 'MENSUAL', 50000, true, true, 0, now(), now()),
  ('svc_cobros', 'Automatizacion de cobros', 'automatizacion-cobros', 'Recordatorios, cobros y confirmaciones de pago automaticas.', 'Automatiza el cobro mensual o anual de tus clientes: recordatorios por correo y WhatsApp, conciliacion de pagos con Wompi y confirmacion automatica cuando el pago se registra.', '#7C3AED', 250000, 'MENSUAL', 50000, true, true, 1, now(), now()),
  ('svc_redes', 'Gestion de redes sociales', 'gestion-redes-sociales', 'Contenido, calendario y estadisticas para tus redes.', 'Manejamos el contenido, la programacion y el analisis de resultados de tus redes sociales (Facebook, Instagram, TikTok y WhatsApp), con reportes mensuales de crecimiento.', '#DB2777', 600000, 'MENSUAL', 50000, true, true, 2, now(), now()),
  ('svc_web', 'Diseno y desarrollo web', 'diseno-desarrollo-web', 'Paginas y landings profesionales que convierten.', 'Diseno y desarrollo de sitios web y landing pages modernas, rapidas y optimizadas para convertir visitantes en clientes.', '#2563EB', 1800000, 'ANUAL', 50000, true, true, 3, now(), now())
ON CONFLICT (slug) DO NOTHING;
