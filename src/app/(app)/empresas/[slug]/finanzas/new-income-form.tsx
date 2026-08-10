"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { createIncome } from "@/lib/actions/finance";

export default function NewIncomeForm({
  companyId,
  companySlug,
}: {
  companyId: string;
  companySlug: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createIncome, {});
  const formRef = useRef<HTMLFormElement>(null);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
    }
  }, [state?.success]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
      >
        <Plus size={16} />
        Registrar ingreso
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Registrar ingreso</h2>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form ref={formRef} action={formAction} className="space-y-3">
          <input type="hidden" name="companyId" value={companyId} />
          <input type="hidden" name="companySlug" value={companySlug} />

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Monto (COP)</label>
            <input
              name="amount"
              type="number"
              min={1}
              step={1}
              required
              placeholder="Ej: 850000"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Fecha</label>
            <input
              name="date"
              type="date"
              defaultValue={today}
              required
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Descripcion</label>
            <input
              name="description"
              required
              placeholder="Ej: Factura #045 - servicio mensual"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Cliente (opcional)
            </label>
            <input
              name="client"
              placeholder="Nombre del cliente o paciente"
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
            {pending ? "Guardando..." : "Guardar ingreso"}
          </button>
        </form>
      </div>
    </div>
  );
}
