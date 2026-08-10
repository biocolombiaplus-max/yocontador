import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/send";
import { buildReminderEmail, buildPaymentConfirmationEmail } from "@/lib/email/templates";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { generateWompiPaymentLink } from "@/lib/wompi";

const SUPPORT_WHATSAPP = process.env.SUPPORT_WHATSAPP ?? "573505457420";

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function diasEntre(fecha: Date, hoy: Date): number {
  return Math.round((startOfDay(fecha).getTime() - startOfDay(hoy).getTime()) / 86_400_000);
}

function planDeAvisos(period: "MENSUAL" | "ANUAL"): number[] {
  return period === "ANUAL" ? [8, 5, 3, 1, 0] : [2, 0];
}

function buildReference(clientFirstName: string, clientLastName: string, serviceName: string) {
  const clean = (s: string) => s.replace(/\s/g, "").toUpperCase();
  return (
    "BM-" +
    clean(clientFirstName).slice(0, 4) +
    clean(clientLastName).slice(0, 4) +
    "-" +
    clean(serviceName).slice(0, 5) +
    "-" +
    Date.now()
  );
}

/** Avanza la fecha de renovacion preservando el dia original de cobro del cliente. */
function advanceRenewalDate(initialChargeDate: Date, currentRenewal: Date, period: "MENSUAL" | "ANUAL"): Date {
  const diaOriginal = initialChargeDate.getDate();
  const nueva = new Date(currentRenewal);

  if (period === "MENSUAL") {
    nueva.setMonth(nueva.getMonth() + 1);
    const maxDia = new Date(nueva.getFullYear(), nueva.getMonth() + 1, 0).getDate();
    nueva.setDate(Math.min(diaOriginal, maxDia));
  } else {
    nueva.setFullYear(nueva.getFullYear() + 1);
    nueva.setDate(diaOriginal);
  }
  return nueva;
}

async function alreadySent(
  subscriptionId: string,
  type: "RECORDATORIO" | "VENCIMIENTO" | "SUSPENSION",
  channel: "EMAIL" | "WHATSAPP",
  key: string
): Promise<boolean> {
  const existing = await prisma.reminderLog.findUnique({
    where: {
      subscriptionId_type_channel_dateKey: { subscriptionId, type, channel, dateKey: key },
    },
  });
  return !!existing;
}

async function logReminder(
  subscriptionId: string,
  type: "RECORDATORIO" | "VENCIMIENTO" | "SUSPENSION" | "CONFIRMACION_PAGO",
  daysOffset: number,
  key: string
) {
  await prisma.reminderLog.create({
    data: { subscriptionId, type, channel: "EMAIL", daysOffset, dateKey: key },
  });
}

export type ReminderSweepResult = {
  processed: number;
  emailsSent: number;
  suspended: number;
  errors: string[];
};

/** Recorre las suscripciones activas y envia recordatorios / avisos de vencimiento / suspension. */
export async function runReminderSweep(): Promise<ReminderSweepResult> {
  const hoy = startOfDay(new Date());
  const key = dateKey(hoy);
  const result: ReminderSweepResult = { processed: 0, emailsSent: 0, suspended: 0, errors: [] };

  const subscriptions = await prisma.clientSubscription.findMany({
    where: { status: { in: ["AL_DIA", "PENDIENTE", "SUSPENDIDO"] } },
    include: { client: true, service: true },
  });

  for (const sub of subscriptions) {
    result.processed++;
    const diff = diasEntre(sub.renewalDate, hoy);
    const plan = planDeAvisos(sub.period);
    const clientName = `${sub.client.firstName} ${sub.client.lastName}`.trim();
    const whatsappReminder = buildWhatsAppLink(
      sub.client.phone,
      `Hola ${sub.client.firstName}, te escribe Bio Marketing sobre tu servicio: ${sub.service.name}`
    );

    try {
      if (plan.includes(diff) && sub.status !== "SUSPENDIDO") {
        const type: "RECORDATORIO" | "VENCIMIENTO" = diff === 0 ? "VENCIMIENTO" : "RECORDATORIO";
        const already = await alreadySent(sub.id, type, "EMAIL", key);
        if (!already) {
          const reference = buildReference(sub.client.firstName, sub.client.lastName, sub.service.name);
          const paymentUrl =
            generateWompiPaymentLink({
              fullName: clientName,
              amountCOP: sub.priceCOP,
              reference,
              redirectWhatsAppUrl: buildWhatsAppLink(
                SUPPORT_WHATSAPP,
                `Hola! Acabo de pagar el servicio ${sub.service.name}. Referencia: ${reference}`
              ),
            }) ?? whatsappReminder;

          const { subject, html } = buildReminderEmail({
            clientName,
            serviceName: sub.service.name,
            amountCOP: sub.priceCOP,
            period: sub.period,
            renewalDate: sub.renewalDate,
            daysOffset: diff,
            type,
            reconnectionFeeCOP: sub.reconnectionFeeCOP,
            paymentUrl,
            whatsappUrl: whatsappReminder,
          });

          const sendResult = await sendEmail({ to: sub.client.email, subject, html });
          if (sendResult.sent) result.emailsSent++;
          await logReminder(sub.id, type, diff, key);

          if (sub.status === "AL_DIA") {
            await prisma.clientSubscription.update({
              where: { id: sub.id },
              data: { status: "PENDIENTE" },
            });
          }
        }
      }

      if (diff === -1 && sub.status !== "SUSPENDIDO") {
        const already = await alreadySent(sub.id, "SUSPENSION", "EMAIL", key);
        if (!already) {
          const totalConReconexion = sub.priceCOP + sub.reconnectionFeeCOP;
          const reference = buildReference(sub.client.firstName, sub.client.lastName, sub.service.name) + "-RECON";
          const paymentUrl =
            generateWompiPaymentLink({
              fullName: clientName,
              amountCOP: totalConReconexion,
              reference,
              redirectWhatsAppUrl: buildWhatsAppLink(
                SUPPORT_WHATSAPP,
                `Hola! Acabo de pagar el servicio ${sub.service.name}. Referencia: ${reference}`
              ),
            }) ?? whatsappReminder;

          const { subject, html } = buildReminderEmail({
            clientName,
            serviceName: sub.service.name,
            amountCOP: sub.priceCOP,
            period: sub.period,
            renewalDate: sub.renewalDate,
            daysOffset: diff,
            type: "SUSPENSION",
            reconnectionFeeCOP: sub.reconnectionFeeCOP,
            paymentUrl,
            whatsappUrl: whatsappReminder,
          });

          const sendResult = await sendEmail({ to: sub.client.email, subject, html });
          if (sendResult.sent) result.emailsSent++;
          await logReminder(sub.id, "SUSPENSION", diff, key);
          await prisma.clientSubscription.update({
            where: { id: sub.id },
            data: { status: "SUSPENDIDO" },
          });
          result.suspended++;
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      result.errors.push(`${sub.id}: ${message}`);
    }
  }

  return result;
}

export type RegisterPaymentInput = {
  subscriptionId: string;
  amountCOP: number;
  method: "MANUAL" | "WOMPI" | "OTRO";
  reference?: string | null;
  paidAt?: Date;
  registeredById?: string | null;
};

export type RegisterPaymentResult = {
  paymentId: string;
  whatsappConfirmationUrl: string;
  emailSent: boolean;
};

/** Registra un pago, restablece la suscripcion y confirma al cliente por correo. */
export async function registerPaymentAndConfirm(
  input: RegisterPaymentInput
): Promise<RegisterPaymentResult> {
  const sub = await prisma.clientSubscription.findUniqueOrThrow({
    where: { id: input.subscriptionId },
    include: { client: true, service: true },
  });

  const payment = await prisma.payment.create({
    data: {
      subscriptionId: sub.id,
      amount: input.amountCOP,
      method: input.method,
      reference: input.reference ?? null,
      paidAt: input.paidAt ?? new Date(),
      registeredById: input.registeredById ?? null,
    },
  });

  const nuevaRenovacion = advanceRenewalDate(sub.initialChargeDate, sub.renewalDate, sub.period);

  await prisma.clientSubscription.update({
    where: { id: sub.id },
    data: { status: "AL_DIA", renewalDate: nuevaRenovacion },
  });

  const clientName = `${sub.client.firstName} ${sub.client.lastName}`.trim();
  const whatsappUrl = buildWhatsAppLink(
    sub.client.phone,
    `Hola ${sub.client.firstName}! Confirmamos tu pago de ${sub.service.name}. Tu servicio ya esta restablecido y activo. Gracias por confiar en Bio Marketing.`
  );

  const { subject, html } = buildPaymentConfirmationEmail({
    clientName,
    serviceName: sub.service.name,
    amountCOP: input.amountCOP,
    reference: input.reference || payment.id,
    whatsappUrl: buildWhatsAppLink(
      SUPPORT_WHATSAPP,
      `Hola, te escribo por el servicio ${sub.service.name} de ${clientName}`
    ),
  });

  const sendResult = await sendEmail({ to: sub.client.email, subject, html });
  await logReminder(sub.id, "CONFIRMACION_PAGO", 0, dateKey(new Date()));

  return { paymentId: payment.id, whatsappConfirmationUrl: whatsappUrl, emailSent: sendResult.sent };
}
