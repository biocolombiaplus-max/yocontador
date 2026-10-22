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
  const serviceId = formData.get("serviceId")?.toString() || null;
  const conceptName = formData.get("conceptName")?.toString().trim() || null;
  const currency = (formData.get("currency")?.toString() || "COP") as "COP" | "USD";
  const billingType = (formData.get("billingType")?.toString() || "FIJO") as
    | "FIJO"
    | "PORCENTAJE_VENTA"
    | "VALOR_POR_VENTA";
  const period = (formData.get("period")?.toString() || "MENSUAL") as "MENSUAL" | "ANUAL";
  const initialChargeDateRaw = formData.get("initialChargeDate")?.toString();
  const reconnectionFeeCOP = Math.round(Number(formData.get("reconnectionFeeCOP")) || 0);

  if (!clientId) return { error: "Solicitud invalida." };
  if (!serviceId && !conceptName) {
    return { error: "Elige un servicio del catalogo o escribe un concepto personalizado." };
  }
  if (!initialChargeDateRaw) return { error: "La fecha de cobro inicial es obligatoria." };

  let priceCOP = 0;
  let priceUSD: number | null = null;
  let commissionRate: number | null = null;
  let valorPorVenta: number | null = null;

  if (billingType === "FIJO") {
    const amountRaw = Number(formData.get("amount"));
    if (!amountRaw || amountRaw <= 0) return { error: "El precio debe ser mayor a cero." };
    if (currency === "USD") {
      priceUSD = Math.round(amountRaw * 100);
    } else {
      priceCOP = Math.round(amountRaw);
    }
  } else if (billingType === "PORCENTAJE_VENTA") {
    commissionRate = Number(formData.get("commissionRate"));
    if (!commissionRate || commissionRate <= 0 || commissionRate > 100) {
      return { error: "El porcentaje debe estar entre 0 y 100." };
    }
  } else if (billingType === "VALOR_POR_VENTA") {
    valorPorVenta = Math.round(Number(formData.get("valorPorVenta")));
    if (!valorPorVenta || valorPorVenta <= 0) {
      return { error: "El valor por venta debe ser mayor a cero." };
    }
  }

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
      conceptName: serviceId ? null : conceptName,
      currency,
      priceCOP,
      priceUSD,
      billingType,
      commissionRate,
      valorPorVenta,
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

export type UpdateSalesBasisState = { error?: string; success?: boolean };

/** Guarda las ventas del periodo (monto o unidades) para calcular el cobro variable. */
export async function updatePendingSalesBasis(
  _prevState: UpdateSalesBasisState,
  formData: FormData
): Promise<UpdateSalesBasisState> {
  await requireSession();

  const subscriptionId = formData.get("subscriptionId")?.toString();
  const clientId = formData.get("clientId")?.toString();
  const pendingSalesBasis = Math.round(Number(formData.get("pendingSalesBasis")));

  if (!subscriptionId || !clientId) return { error: "Solicitud invalida." };
  if (!pendingSalesBasis || pendingSalesBasis <= 0) {
    return { error: "Ingresa un valor mayor a cero." };
  }

  await prisma.clientSubscription.update({
    where: { id: subscriptionId },
    data: { pendingSalesBasis },
  });

  revalidatePath(`/clientes/${clientId}`);
  revalidatePath("/clientes");
  return { success: true };
}
