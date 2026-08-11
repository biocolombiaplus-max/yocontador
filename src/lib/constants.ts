export const GROUP_NAME = "Bio Marketing";

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

export const EXPENSE_CATEGORY_META = {
  NOMINA: { label: "Nomina" },
  ARRIENDO: { label: "Arriendo" },
  SERVICIOS: { label: "Servicios" },
  MARKETING: { label: "Marketing" },
  INSUMOS: { label: "Insumos" },
  TECNOLOGIA: { label: "Tecnologia" },
  IMPUESTOS: { label: "Impuestos" },
  OTRO: { label: "Otro" },
} as const;

export const PROFIT_PARTNERS = [
  { name: "Juan Carlos Caceres", share: 0.5, color: "#0EA5A4" },
  { name: "Nicol Bustos", share: 0.5, color: "#DB2777" },
] as const;

export const SUBSCRIPTION_STATUS_META = {
  AL_DIA: { label: "Al dia", tone: "success" },
  PENDIENTE: { label: "Pendiente", tone: "warning" },
  SUSPENDIDO: { label: "Suspendido", tone: "danger" },
  CANCELADO: { label: "Cancelado", tone: "neutral" },
} as const;

export const PAYMENT_METHOD_META = {
  MANUAL: { label: "Manual" },
  WOMPI: { label: "Wompi" },
  OTRO: { label: "Otro" },
} as const;

export const BILLING_PERIOD_META = {
  MENSUAL: { label: "Mensual" },
  ANUAL: { label: "Anual" },
} as const;
