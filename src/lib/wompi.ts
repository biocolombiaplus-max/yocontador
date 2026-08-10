const WOMPI_PUBLIC_KEY = process.env.WOMPI_PUBLIC_KEY;
const WOMPI_PRIVATE_KEY = process.env.WOMPI_PRIVATE_KEY;
const WOMPI_API_BASE = process.env.WOMPI_SANDBOX
  ? "https://sandbox.wompi.co/v1"
  : "https://production.wompi.co/v1";

export function generateWompiPaymentLink(input: {
  fullName: string;
  amountCOP: number;
  reference: string;
  redirectWhatsAppUrl: string;
}): string | null {
  if (!WOMPI_PUBLIC_KEY) return null;

  const amountCents = Math.round(input.amountCOP * 100);
  const params = new URLSearchParams({
    "public-key": WOMPI_PUBLIC_KEY,
    currency: "COP",
    "amount-in-cents": String(amountCents),
    reference: input.reference,
    "redirect-url": input.redirectWhatsAppUrl,
    "customer-data:full-name": input.fullName,
  });
  return `https://checkout.wompi.co/p/?${params.toString()}`;
}

export type WompiTransaction = {
  id: string;
  status: string;
  reference: string;
  amountInCents: number;
  customerEmail: string;
};

export async function fetchApprovedWompiTransactions(): Promise<WompiTransaction[]> {
  if (!WOMPI_PRIVATE_KEY) {
    console.warn("[wompi] WOMPI_PRIVATE_KEY no configurada. No se consultaron transacciones.");
    return [];
  }

  const response = await fetch(
    `${WOMPI_API_BASE}/transactions?page_size=50&status=APPROVED`,
    {
      headers: { Authorization: `Bearer ${WOMPI_PRIVATE_KEY}` },
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error("[wompi] Error consultando transacciones:", response.status, await response.text());
    return [];
  }

  const body = await response.json();
  const data: unknown[] = Array.isArray(body?.data) ? body.data : [];

  return data
    .filter((tx): tx is Record<string, unknown> => typeof tx === "object" && tx !== null)
    .map((tx) => ({
      id: String(tx.id ?? ""),
      status: String(tx.status ?? ""),
      reference: String(tx.reference ?? ""),
      amountInCents: Number(tx.amount_in_cents ?? 0),
      customerEmail: String(tx.customer_email ?? "").toLowerCase(),
    }))
    .filter((tx) => tx.status === "APPROVED");
}
