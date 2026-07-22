export const GROUP_NAME = "BIO COLOMBIA";

export const PLATFORM_META = {
  FACEBOOK: { label: "Facebook", color: "#1877F2" },
  INSTAGRAM: { label: "Instagram", color: "#E1306C" },
  WHATSAPP: { label: "WhatsApp", color: "#25D366" },
  TIKTOK: { label: "TikTok", color: "#111827" },
} as const;

export const SOCIAL_ACCOUNT_STATUS_META = {
  CONECTADA: { label: "Conectada", tone: "success" },
  PENDIENTE: { label: "Pendiente", tone: "warning" },
  DESCONECTADA: { label: "Desconectada", tone: "neutral" },
} as const;

export const CONTENT_STATUS_META = {
  BORRADOR: { label: "Borrador", tone: "neutral" },
  PROGRAMADO: { label: "Programado", tone: "info" },
  PUBLICADO: { label: "Publicado", tone: "success" },
  FALLIDO: { label: "Fallido", tone: "danger" },
} as const;

export const MEDIA_TYPE_META = {
  IMAGEN: { label: "Imagen" },
  VIDEO: { label: "Video" },
  REEL: { label: "Reel" },
  CARRUSEL: { label: "Carrusel" },
} as const;

export const ROLE_META = {
  PROPIETARIO: { label: "Propietario" },
  ADMINISTRADORA: { label: "Administradora" },
} as const;
