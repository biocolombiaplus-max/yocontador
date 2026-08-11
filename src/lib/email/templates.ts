import { formatCOP } from "@/lib/money";

const BRAND = {
  name: "Bio Marketing",
  tagline: "Innovacion Digital",
  purpleDark: "#2A0854",
  purpleHeader: "#3B0764",
  orange: "#FF6B00",
  orangeDark: "#E55A00",
  green: "#0F3D20",
  greenLight: "#A7F3D0",
  lilac: "#E9D5FF",
  lilacMuted: "#C4B5FD",
  surface: "#F5F0FF",
  ink: "#1A0A2E",
  muted: "#6B7280",
};

function iconCircle(symbol: string, bg: string) {
  return `<div style="width:56px;height:56px;background:${bg};border-radius:50%;margin:0 auto 16px;line-height:56px;text-align:center;font-size:26px;font-weight:800;color:#ffffff;">${symbol}</div>`;
}

function badge(text: string, bg = "#FF6B00") {
  return `<div style="display:inline-block;background:${bg};color:#ffffff;padding:6px 22px;border-radius:30px;font-size:10px;font-weight:800;letter-spacing:2.5px;margin-bottom:16px;">${text}</div>`;
}

function serviceTable(service: string, period: string, amountFmt: string) {
  return `
  <table width="100%" cellpadding="0" cellspacing="0" style="border:2px solid #ede8f5;border-radius:14px;overflow:hidden;border-collapse:separate;">
    <thead>
      <tr style="background:${BRAND.purpleHeader};">
        <th style="padding:12px 16px;text-align:left;color:${BRAND.lilac};font-size:11px;text-transform:uppercase;letter-spacing:1px;">Servicio</th>
        <th style="padding:12px 16px;text-align:center;color:${BRAND.lilac};font-size:11px;text-transform:uppercase;letter-spacing:1px;">Periodo</th>
        <th style="padding:12px 16px;text-align:right;color:${BRAND.lilac};font-size:11px;text-transform:uppercase;letter-spacing:1px;">Valor</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:16px;color:${BRAND.purpleDark};font-size:14px;font-weight:700;border-bottom:2px solid #ede8f5;">${service}</td>
        <td style="padding:16px;text-align:center;border-bottom:2px solid #ede8f5;"><span style="background:#f3eeff;color:#6b21a8;padding:5px 14px;border-radius:20px;font-size:12px;font-weight:700;">${period}</span></td>
        <td style="padding:16px;text-align:right;color:${BRAND.purpleHeader};font-size:18px;font-weight:900;border-bottom:2px solid #ede8f5;">${amountFmt}</td>
      </tr>
    </tbody>
  </table>`;
}

function warningBox(message: string) {
  return `
  <tr><td style="padding:0 40px 24px;">
    <div style="background:#fff8f0;border-left:5px solid ${BRAND.orange};border-radius:0 12px 12px 0;padding:20px 24px;">
      <p style="margin:0 0 8px;color:#7c2d00;font-size:12px;font-weight:800;text-transform:uppercase;letter-spacing:0.5px;">Aviso importante</p>
      <p style="margin:0;color:#7c2d00;font-size:13px;line-height:1.8;">${message}</p>
    </div>
  </td></tr>`;
}

function shell(opts: {
  preheader: string;
  headerBg: string;
  badgeText: string;
  badgeColor?: string;
  icon: string;
  iconBg: string;
  title: string;
  subtitle: string;
  bodyHtml: string;
  serviceBlock?: string;
  warningHtml?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaHint?: string;
  whatsappUrl: string;
  whatsappLabel?: string;
}) {
  return `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<title>${opts.title}</title>
<style>
body{margin:0;padding:0;background:${BRAND.surface};font-family:Arial,Helvetica,sans-serif;}
@media only screen and (max-width:600px){
.wrapper{width:100%!important;border-radius:0!important;}
.pad{padding:24px 20px!important;}
.btn-pay{display:block!important;text-align:center!important;padding:16px 20px!important;font-size:15px!important;}
}
</style></head><body>
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${opts.preheader}</div>
<table width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.surface};padding:28px 0;">
<tr><td align="center">
<table class="wrapper" width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(59,7,100,0.10);">

<tr><td style="background:${opts.headerBg};padding:40px 40px 32px;text-align:center;">
  ${badge(opts.badgeText, opts.badgeColor)}<br>
  ${iconCircle(opts.icon, opts.iconBg)}
  <h1 style="color:#ffffff;margin:0 0 8px;font-size:24px;font-weight:900;letter-spacing:0.2px;">${BRAND.name}</h1>
  <p style="color:${BRAND.lilac};margin:0 0 4px;font-size:17px;font-weight:700;">${opts.title}</p>
  <p style="color:${BRAND.lilacMuted};margin:0;font-size:12px;">${opts.subtitle}</p>
</td></tr>
<tr><td style="background:linear-gradient(90deg,${BRAND.orange},#FF9500);height:5px;"></td></tr>

<tr><td class="pad" style="padding:32px 40px 20px;">
  <p style="color:${BRAND.ink};font-size:15px;line-height:1.85;margin:0;">${opts.bodyHtml}</p>
</td></tr>

${opts.serviceBlock ? `<tr><td class="pad" style="padding:0 40px 20px;">${opts.serviceBlock}</td></tr>` : ""}

${opts.warningHtml ?? ""}

${
  opts.ctaUrl
    ? `<tr><td class="pad" style="padding:0 40px 28px;text-align:center;">
        <a href="${opts.ctaUrl}" class="btn-pay" style="background:${BRAND.orange};color:#ffffff;padding:16px 48px;border-radius:40px;font-size:16px;font-weight:900;display:inline-block;letter-spacing:0.8px;text-transform:uppercase;border:3px solid ${BRAND.orangeDark};text-decoration:none;">${opts.ctaLabel}</a>
        ${opts.ctaHint ? `<p style="margin:10px 0 0;color:#9ca3af;font-size:11px;">${opts.ctaHint}</p>` : ""}
      </td></tr>`
    : ""
}

<tr><td style="padding:0 40px;"><div style="height:1px;background:#ede8f5;"></div></td></tr>

<tr><td class="pad" style="padding:24px 40px;text-align:center;">
  <p style="color:#9ca3af;font-size:12px;margin:0 0 14px;">Tienes preguntas? Hablemos directamente</p>
  <a href="${opts.whatsappUrl}" style="background:#25D366;color:#ffffff;padding:12px 32px;border-radius:30px;font-size:13px;font-weight:800;display:inline-block;text-decoration:none;">${opts.whatsappLabel ?? "Escribenos por WhatsApp"}</a>
</td></tr>

<tr><td style="background:${BRAND.purpleDark};padding:22px 40px;">
  <p style="color:${BRAND.lilac};font-size:13px;font-weight:800;margin:0 0 4px;text-align:center;">${BRAND.name}</p>
  <p style="color:#7c3aed;font-size:11px;margin:0 0 8px;font-weight:600;text-align:center;">${BRAND.tagline}</p>
  <p style="color:#6d28d9;font-size:10px;margin:0;line-height:1.8;text-align:center;">
    ${process.env.EMAIL_USER ?? "contacto@biomarketing.com"} &nbsp;|&nbsp; WhatsApp: ${process.env.SUPPORT_WHATSAPP ?? ""}<br>
    Este es un correo automatico. Para soporte usa WhatsApp.
  </p>
</td></tr>
<tr><td style="background:linear-gradient(90deg,${BRAND.orange},#FF9500);height:4px;"></td></tr>

</table></td></tr></table></body></html>`;
}

export type ReminderEmailInput = {
  clientName: string;
  serviceName: string;
  amountCOP: number;
  period: "MENSUAL" | "ANUAL";
  renewalDate: Date;
  daysOffset: number;
  type: "RECORDATORIO" | "VENCIMIENTO" | "SUSPENSION";
  reconnectionFeeCOP: number;
  paymentUrl: string;
  whatsappUrl: string;
};

export function buildReminderEmail(input: ReminderEmailInput): { subject: string; html: string } {
  const period = input.period === "ANUAL" ? "ANUAL" : "MENSUAL";
  const fechaTexto = input.renewalDate.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  if (input.type === "SUSPENSION") {
    const total = input.amountCOP + input.reconnectionFeeCOP;
    return {
      subject: `Servicio suspendido: ${input.serviceName} - Bio Marketing`,
      html: shell({
        preheader: `Tu servicio ${input.serviceName} fue suspendido por falta de pago.`,
        headerBg: "#1A0000",
        badgeText: "SERVICIO SUSPENDIDO",
        badgeColor: "#B91C1C",
        icon: "!",
        iconBg: "#B91C1C",
        title: "Tu servicio ha sido suspendido",
        subtitle: "Pago no recibido",
        bodyHtml: `Hola <strong>${input.clientName}</strong>, lamentamos informarte que tu servicio <strong>${input.serviceName}</strong> fue <strong>suspendido</strong> porque no recibimos el pago en la fecha acordada.<br><br>Para reactivarlo, realiza el pago del periodo vencido mas el cargo de reconexion detallado abajo.`,
        serviceBlock: serviceTable(input.serviceName, period, formatCOP(total)),
        warningHtml: warningBox(
          `El cargo de reconexion de <strong>${formatCOP(input.reconnectionFeeCOP)}</strong> cubre los costos tecnicos de reactivacion. Aplica cada vez que un servicio se suspende por mora — evitalo pagando antes del vencimiento.`
        ),
        ctaLabel: "Pagar y reactivar",
        ctaUrl: input.paymentUrl,
        ctaHint: "Pago 100% seguro procesado por Wompi",
        whatsappUrl: input.whatsappUrl,
      }),
    };
  }

  if (input.type === "VENCIMIENTO") {
    return {
      subject: `Tu servicio ${input.serviceName} vence hoy - Bio Marketing`,
      html: shell({
        preheader: `${input.serviceName} vence hoy. Paga antes de medianoche para evitar la suspension.`,
        headerBg: "#7C1D00",
        badgeText: "ACCION REQUERIDA HOY",
        badgeColor: "#FF6B00",
        icon: "!",
        iconBg: "#FF6B00",
        title: "Tu servicio vence hoy",
        subtitle: "Paga antes de las 11:59 PM",
        bodyHtml: `Hola <strong>${input.clientName}</strong>, tu servicio <strong>${input.serviceName}</strong> vence <strong>hoy</strong>.<br><br>Realiza tu pago antes de las 11:59 PM para continuar sin interrupciones.`,
        serviceBlock: serviceTable(input.serviceName, period, formatCOP(input.amountCOP)),
        warningHtml: warningBox(
          `Si el pago no se recibe hoy, manana el servicio sera suspendido y se sumara un cargo de reconexion de <strong>${formatCOP(input.reconnectionFeeCOP)}</strong>.`
        ),
        ctaLabel: "Pagar ahora",
        ctaUrl: input.paymentUrl,
        ctaHint: "Pago 100% seguro procesado por Wompi",
        whatsappUrl: input.whatsappUrl,
      }),
    };
  }

  const esUltimoAviso = input.daysOffset <= 1;
  return {
    subject: esUltimoAviso
      ? `Ultimo aviso: ${input.serviceName} vence manana - Bio Marketing`
      : `Recordatorio: ${input.serviceName} se renueva en ${input.daysOffset} dias - Bio Marketing`,
    html: shell({
      preheader: `Tu servicio ${input.serviceName} se renueva el ${fechaTexto}.`,
      headerBg: esUltimoAviso ? "#7C3A00" : BRAND.purpleHeader,
      badgeText: esUltimoAviso ? `ULTIMO AVISO - ${input.daysOffset} DIA` : `${input.daysOffset} DIAS PARA RENOVAR`,
      badgeColor: esUltimoAviso ? "#FF6B00" : "#7C3AED",
      icon: "⏰",
      iconBg: esUltimoAviso ? "#FF6B00" : "#7C3AED",
      title: esUltimoAviso ? "Tu servicio vence manana" : "Proximamente: renovacion de servicio",
      subtitle: esUltimoAviso ? "Evita cargos adicionales pagando hoy" : "Te avisamos con anticipacion",
      bodyHtml: `Hola <strong>${input.clientName}</strong>, te recordamos que tu servicio <strong>${input.serviceName}</strong> se renueva el <strong>${fechaTexto}</strong> (${input.daysOffset} ${input.daysOffset === 1 ? "dia" : "dias"}).<br><br>Puedes pagar desde ahora para mayor comodidad y evitar cualquier inconveniente.`,
      serviceBlock: serviceTable(input.serviceName, period, formatCOP(input.amountCOP)),
      warningHtml: esUltimoAviso
        ? warningBox(
            `Si el pago no se recibe antes del vencimiento, el servicio sera suspendido y se aplicara un cargo adicional de <strong>${formatCOP(input.reconnectionFeeCOP)}</strong> por reconexion.`
          )
        : undefined,
      ctaLabel: "Pagar ahora",
      ctaUrl: input.paymentUrl,
      ctaHint: "Pago 100% seguro procesado por Wompi",
      whatsappUrl: input.whatsappUrl,
    }),
  };
}

export type PaymentConfirmationInput = {
  clientName: string;
  serviceName: string;
  amountCOP: number;
  reference: string;
  whatsappUrl: string;
};

export function buildPaymentConfirmationEmail(input: PaymentConfirmationInput): {
  subject: string;
  html: string;
} {
  return {
    subject: `Pago confirmado: ${input.serviceName} - Bio Marketing`,
    html: shell({
      preheader: `Recibimos tu pago de ${formatCOP(input.amountCOP)}. Tu servicio ${input.serviceName} sigue activo.`,
      headerBg: BRAND.green,
      badgeText: "PAGO CONFIRMADO",
      badgeColor: "#0CA30C",
      icon: "✓",
      iconBg: "#0CA30C",
      title: "Pago exitoso",
      subtitle: BRAND.tagline,
      bodyHtml: `Hola <strong>${input.clientName}</strong>, tu pago fue procesado exitosamente y tu servicio <strong>${input.serviceName}</strong> quedo <strong>restablecido y activo</strong>, sin interrupciones. Gracias por tu confianza.`,
      serviceBlock: `
        <div style="background:#f3eeff;border-radius:14px;padding:28px;text-align:center;border:2px solid #c4b5fd;">
          <p style="margin:0 0 4px;color:#6b21a8;font-size:10px;text-transform:uppercase;letter-spacing:1.5px;font-weight:800;">Monto pagado</p>
          <p style="margin:0;color:${BRAND.purpleHeader};font-size:38px;font-weight:900;">${formatCOP(input.amountCOP)}</p>
          <div style="margin:14px 0 0;height:1px;background:#ede8f5;"></div>
          <p style="margin:12px 0 4px;color:#9ca3af;font-size:12px;">Servicio: <strong style="color:${BRAND.purpleHeader};">${input.serviceName}</strong></p>
          <p style="margin:0;color:${BRAND.lilacMuted};font-size:11px;">Ref: ${input.reference}</p>
        </div>`,
      whatsappUrl: input.whatsappUrl,
      whatsappLabel: "Contactar a Bio Marketing",
    }),
  };
}
