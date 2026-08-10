"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { createExpense } from "@/lib/actions/finance";
import { EXPENSE_CATEGORY_META } from "@/lib/constants";

export default function NewExpenseForm({
  companyId,
  companySlug,
}: {
  companyId: string;
  companySlug: string;
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createExpense, {});
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
        className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
      >
        <Plus size={16} />
        Registrar gasto
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Registrar gasto</h2>
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
              placeholder="Ej: 320000"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/30"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">Fecha</label>
              <input
                name="date"
                type="date"
                defaultValue={today}
                required
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/30"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">Categoria</label>
              <select
                name="category"
                defaultValue="OTRO"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/30"
              >
                {Object.entries(EXPENSE_CATEGORY_META).map(([value, meta]) => (
                  <option key={value} value={value}>
                    {meta.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Descripcion</label>
            <input
              name="description"
              required
              placeholder="Ej: Pago de arriendo julio"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/30"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Guardar gasto"}
          </button>
        </form>
      </div>
    </div>
  );
}
