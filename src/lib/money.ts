export function formatCOP(amount: number): string {
  return amount.toLocaleString("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  });
}

/** amountCents: monto en centavos de dolar (p.ej. 2500 = $25.00). */
export function formatUSD(amountCents: number): string {
  return (amountCents / 100).toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
  });
}

/** amount esta en pesos para COP y en centavos para USD. */
export function formatMoney(amount: number, currency: "COP" | "USD"): string {
  return currency === "USD" ? formatUSD(amount) : formatCOP(amount);
}
