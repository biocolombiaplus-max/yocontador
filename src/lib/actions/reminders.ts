"use server";

import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { formatMoney } from "@/lib/money";
import { computeChargeAmount, conceptLabel } from "@/lib/crm/billing";

export type SendWhatsAppReminderState = {
  error?: string;
  success?: boolean;
  whatsappUrl?: string;
};

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/**
 * Genera el link de WhatsApp con el cobro del periodo y registra el envio
 * (idempotente por dia) para que el panel muestre "enviado hoy".
 */
export async function sendWhatsAppReminderAction(
  subscriptionId: string
): Promise<SendWhatsAppReminderState> {
  await requireSession();

  const sub = await prisma.clientSubscription.findUnique({
    where: { id: subscriptionId },
    include: { client: true, service: true },
  });
  if (!sub) return { error: "Suscripcion no encontrada." };

  const charge = computeChargeAmount(sub);
  if (!charge.ready) {
    return { error: "Ingresa las ventas del periodo antes de enviar el cobro." };
  }

  const concept = conceptLabel(sub);
  const fechaTexto = sub.renewalDate.toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const hoy = startOfDay(new Date());
  const diff = Math.round((startOfDay(sub.renewalDate).getTime() - hoy.getTime()) / 86_400_000);
  const vencido = diff < 0;

  const message = vencido
    ? `Hola ${sub.client.firstName}! Te escribe Bio Marketing. Tu servicio "${concept}" esta vencido desde el ${fechaTexto}. El valor pendiente es ${formatMoney(charge.amount, charge.currency)}. Quedamos atentos a tu pago para seguir sin interrupciones. Gracias!`
    : `Hola ${sub.client.firstName}! Te escribe Bio Marketing para recordarte que tu servicio "${concept}" se renueva el ${fechaTexto}. El valor es ${formatMoney(charge.amount, charge.currency)}. Quedamos atentos a tu pago. Gracias!`;

  const whatsappUrl = buildWhatsAppLink(sub.client.phone, message);

  const type = diff <= 0 ? "VENCIMIENTO" : "RECORDATORIO";
  const key = dateKey(new Date());
  await prisma.reminderLog.upsert({
    where: {
      subscriptionId_type_channel_dateKey: {
        subscriptionId: sub.id,
        type,
        channel: "WHATSAPP",
        dateKey: key,
      },
    },
    update: {},
    create: {
      subscriptionId: sub.id,
      type,
      channel: "WHATSAPP",
      daysOffset: diff,
      dateKey: key,
    },
  });

  return { success: true, whatsappUrl };
}
