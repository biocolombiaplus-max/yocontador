"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Plus, X } from "lucide-react";
import { createContentPost } from "@/lib/actions/content";
import { PLATFORM_META } from "@/lib/constants";

type SocialAccount = {
  id: string;
  platform: keyof typeof PLATFORM_META;
  handle: string;
};

export default function NewContentForm({
  companyId,
  companySlug,
  socialAccounts,
}: {
  companyId: string;
  companySlug: string;
  socialAccounts: SocialAccount[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(createContentPost, {});
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
        Nueva publicacion
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Nueva publicacion</h2>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form ref={formRef} action={formAction} className="space-y-3">
          <input type="hidden" name="companyId" value={companyId} />
          <input type="hidden" name="companySlug" value={companySlug} />

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Titulo interno</label>
            <input
              name="title"
              required
              placeholder="Ej: Campana lanzamiento julio"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Texto / caption
            </label>
            <textarea
              name="caption"
              required
              rows={3}
              placeholder="Escribe el texto que acompanara la publicacion"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">Tipo</label>
              <select
                name="mediaType"
                defaultValue="IMAGEN"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              >
                <option value="IMAGEN">Imagen</option>
                <option value="VIDEO">Video</option>
                <option value="REEL">Reel</option>
                <option value="CARRUSEL">Carrusel</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">Estado</label>
              <select
                name="status"
                defaultValue="BORRADOR"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              >
                <option value="BORRADOR">Borrador</option>
                <option value="PROGRAMADO">Programado</option>
                <option value="PUBLICADO">Publicado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Imagen, video o reel (opcional)
            </label>
            <input
              name="media"
              type="file"
              accept="image/*,video/*"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-2.5 file:py-1 file:text-xs file:font-medium"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Fecha y hora programada (opcional)
            </label>
            <input
              name="scheduledAt"
              type="datetime-local"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Redes destino
            </label>
            <div className="grid grid-cols-2 gap-2">
              {socialAccounts.map((a) => (
                <label
                  key={a.id}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs text-slate-700"
                >
                  <input type="checkbox" name="targets" value={a.id} className="accent-brand" />
                  {PLATFORM_META[a.platform].label}
                </label>
              ))}
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
            {pending ? "Guardando..." : "Guardar publicacion"}
          </button>
        </form>
      </div>
    </div>
  );
}
