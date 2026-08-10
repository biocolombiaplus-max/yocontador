"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { createService } from "@/lib/actions/services";

export default function NewServiceForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createService, {});
  const formRef = useRef<HTMLFormElement>(null);

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
        className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
      >
        <Plus size={16} />
        Nuevo servicio
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Nuevo servicio</h2>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form ref={formRef} action={formAction} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Nombre del servicio</label>
            <input
              name="name"
              required
              placeholder="Ej: Automatizacion WhatsApp + IA"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Descripcion corta (para tarjetas)
            </label>
            <input
              name="shortDescription"
              required
              placeholder="Una frase que resuma el servicio"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Descripcion completa (landing)
            </label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Explica el servicio para la landing publica"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">Precio (COP)</label>
              <input
                name="defaultPriceCOP"
                type="number"
                min={1}
                step={1}
                required
                placeholder="Ej: 350000"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">Periodo</label>
              <select
                name="defaultPeriod"
                defaultValue="MENSUAL"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              >
                <option value="MENSUAL">Mensual</option>
                <option value="ANUAL">Anual</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Color</label>
              <input
                name="colorHex"
                type="color"
                defaultValue="#7C3AED"
                className="h-9 w-14 rounded-lg border border-slate-200"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Cargo de reconexion (COP)
            </label>
            <input
              name="reconnectionFeeCOP"
              type="number"
              min={0}
              step={1}
              defaultValue={50000}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">Logo</label>
              <input
                name="logo"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs file:font-medium"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Imagen de portada
              </label>
              <input
                name="heroImage"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs file:font-medium"
              />
            </div>
          </div>

          {state?.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {pending ? "Creando..." : "Crear servicio"}
          </button>
        </form>
      </div>
    </div>
  );
}
