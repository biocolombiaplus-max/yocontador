"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { createCompany } from "@/lib/actions/companies";

export default function NewCompanyForm() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createCompany, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      // Closing the dialog here reacts to the server action's result, not to
      // a value derivable from props/state during render.
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
        Nueva empresa
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Agregar nueva empresa</h2>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form ref={formRef} action={formAction} className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Nombre de la empresa
            </label>
            <input
              name="name"
              required
              placeholder="Ej: BioLogistica"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Sector / rubro</label>
            <input
              name="sector"
              required
              placeholder="Ej: Logistica para clinicas"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Descripcion</label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="A que se dedica esta empresa del grupo"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Sitio web (opcional)
              </label>
              <input
                name="website"
                type="url"
                placeholder="https://..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Color</label>
              <input
                name="colorHex"
                type="color"
                defaultValue="#0EA5A4"
                className="h-9 w-14 rounded-lg border border-slate-200"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Logo (opcional, lo puedes agregar despues)
            </label>
            <input
              name="logo"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs"
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
            {pending ? "Creando..." : "Crear empresa"}
          </button>
        </form>
      </div>
    </div>
  );
}
