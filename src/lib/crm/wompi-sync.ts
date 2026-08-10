import { prisma } from "@/lib/prisma";
import { fetchApprovedWompiTransactions } from "@/lib/wompi";
import { registerPaymentAndConfirm } from "@/lib/crm/reminder-engine";

export type WompiSyncResult = { matched: number; checked: number; errors: string[] };

function serviceKey(name: string): string {
  return name.replace(/\s/g, "").toUpperCase().slice(0, 5);
}

/** Consulta transacciones aprobadas en Wompi y las concilia con suscripciones pendientes. */
export async function syncWompiPayments(): Promise<WompiSyncResult> {
  const transactions = await fetchApprovedWompiTransactions();
  const result: WompiSyncResult = { matched: 0, checked: transactions.length, errors: [] };
  if (transactions.length === 0) return result;

  const pending = await prisma.clientSubscription.findMany({
    where: { status: { in: ["PENDIENTE", "SUSPENDIDO"] } },
    include: { client: true, service: true },
  });

  for (const tx of transactions) {
    const candidate = pending.find(
      (sub) =>
        sub.client.email.toLowerCase() === tx.customerEmail &&
        tx.reference.toUpperCase().includes(serviceKey(sub.service.name))
    );
    if (!candidate) continue;

    try {
      await registerPaymentAndConfirm({
        subscriptionId: candidate.id,
        amountCOP: Math.round(tx.amountInCents / 100),
        method: "WOMPI",
        reference: tx.reference,
      });
      result.matched++;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      result.errors.push(`${tx.reference}: ${message}`);
    }
  }

  return result;
}
