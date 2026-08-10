"use client";

import { useActionState, useState } from "react";
import { CircleDollarSign, X, MessageCircle, CheckCircle2 } from "lucide-react";
import { registerPaymentAction } from "@/lib/actions/payments";

export default function RegisterPaymentForm({
  subscriptionId,
  clientId,
  serviceName,
  suggestedAmount,
}: {
  subscriptionId: string;
  clientId: string;
  serviceName: string;
  suggestedAmount: number;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(registerPaymentAction, {});
  const today = new Date().toISOString().slice(0, 10);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700"
      >
        <CircleDollarSign size={14} />
        Registrar pago
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Registrar pago</h2>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {state?.success ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
              <CheckCircle2 size={18} className="shrink-0" />
              <span>
                Pago registrado. El servicio quedo al dia
                {state.emailSent ? " y se envio la confirmacion por correo." : ", pero el correo no se pudo enviar (revisa las credenciales de correo)."}
              </span>
            </div>
            {state.whatsappConfirmationUrl && (
              <a
                href={state.whatsappConfirmationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                <MessageCircle size={16} />
                Confirmar tambien por WhatsApp
              </a>
            )}
            <button
              onClick={() => setOpen(false)}
              className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form action={formAction} className="space-y-3">
            <input type="hidden" name="subscriptionId" value={subscriptionId} />
            <input type="hidden" name="clientId" value={clientId} />

            <p className="text-xs text-slate-500">
              Servicio: <span className="font-medium text-slate-700">{serviceName}</span>
            </p>

            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Monto pagado (COP)</label>
              <input
                name="amountCOP"
                type="number"
                min={1}
                defaultValue={suggestedAmount}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-slate-600">Fecha</label>
                <input
                  name="paidAt"
                  type="date"
                  defaultValue={today}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-slate-600">Metodo</label>
                <select
                  name="method"
                  defaultValue="MANUAL"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
                >
                  <option value="MANUAL">Manual</option>
                  <option value="WOMPI">Wompi</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Referencia (opcional)
              </label>
              <input
                name="reference"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
              />
            </div>

            {state?.error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-60"
            >
              {pending ? "Registrando..." : "Confirmar pago y notificar al cliente"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
