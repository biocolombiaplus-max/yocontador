"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "@/lib/session";
import { registerPaymentAndConfirm } from "@/lib/crm/reminder-engine";

export type RegisterPaymentFormState = {
  error?: string;
  success?: boolean;
  whatsappConfirmationUrl?: string;
  emailSent?: boolean;
};

export async function registerPaymentAction(
  _prevState: RegisterPaymentFormState,
  formData: FormData
): Promise<RegisterPaymentFormState> {
  const session = await requireSession();

  const subscriptionId = formData.get("subscriptionId")?.toString();
  const clientId = formData.get("clientId")?.toString();
  const amountCOP = Math.round(Number(formData.get("amountCOP")));
  const method = (formData.get("method")?.toString() || "MANUAL") as "MANUAL" | "WOMPI" | "OTRO";
  const reference = formData.get("reference")?.toString().trim() || null;
  const paidAtRaw = formData.get("paidAt")?.toString();

  if (!subscriptionId || !clientId) return { error: "Solicitud invalida." };
  if (!amountCOP || amountCOP <= 0) return { error: "El monto debe ser mayor a cero." };

  try {
    const result = await registerPaymentAndConfirm({
      subscriptionId,
      amountCOP,
      method,
      reference,
      paidAt: paidAtRaw ? new Date(paidAtRaw) : new Date(),
      registeredById: session.user.id,
    });

    revalidatePath(`/clientes/${clientId}`);
    revalidatePath("/clientes");
    revalidatePath("/");

    return {
      success: true,
      whatsappConfirmationUrl: result.whatsappConfirmationUrl,
      emailSent: result.emailSent,
    };
  } catch {
    return { error: "No fue posible registrar el pago. Intenta de nuevo." };
  }
}
