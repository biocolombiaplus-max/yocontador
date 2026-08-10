"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { createSubscription } from "@/lib/actions/subscriptions";
import { formatCOP } from "@/lib/money";

type Service = {
  id: string;
  name: string;
  defaultPriceCOP: number;
  defaultPeriod: "MENSUAL" | "ANUAL";
  reconnectionFeeCOP: number;
};

export default function NewSubscriptionForm({
  clientId,
  services,
}: {
  clientId: string;
  services: Service[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createSubscription, {});
  const formRef = useRef<HTMLFormElement>(null);
  const [selectedService, setSelectedService] = useState<Service | undefined>(services[0]);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
    }
  }, [state?.success]);

  if (services.length === 0) {
    return (
      <p className="text-xs text-slate-500">
        Crea primero un servicio en el catalogo para poder asignarlo a este cliente.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-brand px-3.5 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
      >
        <Plus size={15} />
        Asignar servicio
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Asignar servicio</h2>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form ref={formRef} action={formAction} className="space-y-3">
          <input type="hidden" name="clientId" value={clientId} />

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Servicio</label>
            <select
              name="serviceId"
              defaultValue={services[0]?.id}
              onChange={(e) => setSelectedService(services.find((s) => s.id === e.target.value))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            >
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({formatCOP(s.defaultPriceCOP)})
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Precio acordado (COP)
              </label>
              <input
                name="priceCOP"
                type="number"
                min={1}
                defaultValue={selectedService?.defaultPriceCOP}
                key={selectedService?.id}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">Periodo</label>
              <select
                name="period"
                defaultValue={selectedService?.defaultPeriod}
                key={`period-${selectedService?.id}`}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              >
                <option value="MENSUAL">Mensual</option>
                <option value="ANUAL">Anual</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Fecha de cobro inicial
            </label>
            <input
              name="initialChargeDate"
              type="date"
              defaultValue={today}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              El dia de este mes se preservara en cada renovacion futura.
            </p>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Cargo de reconexion (COP)
            </label>
            <input
              name="reconnectionFeeCOP"
              type="number"
              min={0}
              defaultValue={selectedService?.reconnectionFeeCOP ?? 50000}
              key={`fee-${selectedService?.id}`}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Asignar servicio"}
          </button>
        </form>
      </div>
    </div>
  );
}
