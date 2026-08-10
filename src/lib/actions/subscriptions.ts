"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export type SubscriptionFormState = { error?: string; success?: boolean };

export async function createSubscription(
  _prevState: SubscriptionFormState,
  formData: FormData
): Promise<SubscriptionFormState> {
  await requireSession();

  const clientId = formData.get("clientId")?.toString();
  const serviceId = formData.get("serviceId")?.toString();
  const priceCOP = Math.round(Number(formData.get("priceCOP")));
  const period = (formData.get("period")?.toString() || "MENSUAL") as "MENSUAL" | "ANUAL";
  const initialChargeDateRaw = formData.get("initialChargeDate")?.toString();
  const reconnectionFeeCOP = Math.round(Number(formData.get("reconnectionFeeCOP")) || 50000);

  if (!clientId || !serviceId) return { error: "Solicitud invalida." };
  if (!priceCOP || priceCOP <= 0) return { error: "El precio debe ser mayor a cero." };
  if (!initialChargeDateRaw) return { error: "La fecha de cobro inicial es obligatoria." };

  const initialChargeDate = new Date(initialChargeDateRaw);
  const renewalDate = new Date(initialChargeDate);
  if (period === "MENSUAL") {
    renewalDate.setMonth(renewalDate.getMonth() + 1);
  } else {
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);
  }

  await prisma.clientSubscription.create({
    data: {
      clientId,
      serviceId,
      priceCOP,
      period,
      initialChargeDate,
      renewalDate,
      reconnectionFeeCOP,
      status: "AL_DIA",
    },
  });

  revalidatePath(`/clientes/${clientId}`);
  revalidatePath("/clientes");
  return { success: true };
}

export async function cancelSubscription(subscriptionId: string, clientId: string) {
  await requireSession();
  await prisma.clientSubscription.update({
    where: { id: subscriptionId },
    data: { status: "CANCELADO" },
  });
  revalidatePath(`/clientes/${clientId}`);
  revalidatePath("/clientes");
}
