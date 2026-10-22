export type BillingType = "FIJO" | "PORCENTAJE_VENTA" | "VALOR_POR_VENTA";
export type Currency = "COP" | "USD";

export type ChargeableSubscription = {
  currency: Currency;
  billingType: BillingType;
  priceCOP: number;
  priceUSD: number | null;
  commissionRate: number | null;
  valorPorVenta: number | null;
  pendingSalesBasis: number | null;
};

export type ComputedCharge = {
  /** En pesos para COP, en centavos para USD. */
  amount: number;
  currency: Currency;
  /** false cuando el tipo de cobro es variable y aun no se han ingresado las ventas del periodo. */
  ready: boolean;
};

/** Calcula el monto a cobrar del periodo segun el tipo de cobro configurado. */
export function computeChargeAmount(sub: ChargeableSubscription): ComputedCharge {
  if (sub.billingType === "FIJO") {
    return sub.currency === "USD"
      ? { amount: sub.priceUSD ?? 0, currency: "USD", ready: true }
      : { amount: sub.priceCOP, currency: "COP", ready: true };
  }

  if (sub.pendingSalesBasis == null) {
    return { amount: 0, currency: sub.currency, ready: false };
  }

  if (sub.billingType === "PORCENTAJE_VENTA") {
    const amount = Math.round(sub.pendingSalesBasis * ((sub.commissionRate ?? 0) / 100));
    return { amount, currency: sub.currency, ready: true };
  }

  // VALOR_POR_VENTA: pendingSalesBasis = unidades vendidas
  const amount = Math.round(sub.pendingSalesBasis * (sub.valorPorVenta ?? 0));
  return { amount, currency: sub.currency, ready: true };
}

/** Nombre del concepto a mostrar: el del catalogo de servicios o el personalizado. */
export function conceptLabel(sub: { service?: { name: string } | null; conceptName?: string | null }): string {
  return sub.service?.name ?? sub.conceptName ?? "Servicio";
}
