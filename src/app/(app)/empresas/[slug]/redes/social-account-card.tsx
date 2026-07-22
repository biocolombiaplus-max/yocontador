"use client";

import { useActionState, useState } from "react";
import { Pencil, X, Link2 } from "lucide-react";
import { updateSocialAccount } from "@/lib/actions/social-accounts";
import { Badge } from "@/components/ui";
import { PLATFORM_META, SOCIAL_ACCOUNT_STATUS_META } from "@/lib/constants";

type SocialAccount = {
  id: string;
  platform: keyof typeof PLATFORM_META;
  handle: string;
  displayName: string | null;
  status: keyof typeof SOCIAL_ACCOUNT_STATUS_META;
  followers: number;
  profileUrl: string | null;
  accessToken: string | null;
  notes: string | null;
};

export default function SocialAccountCard({
  account,
  companySlug,
}: {
  account: SocialAccount;
  companySlug: string;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(updateSocialAccount, {});
  const meta = PLATFORM_META[account.platform];
  const statusMeta = SOCIAL_ACCOUNT_STATUS_META[account.status];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: meta.color }} />
          {meta.label}
        </span>
        <div className="flex items-center gap-2">
          <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
          <button
            onClick={() => setEditing((v) => !v)}
            className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label={editing ? "Cerrar" : "Editar"}
          >
            {editing ? <X size={15} /> : <Pencil size={15} />}
          </button>
        </div>
      </div>

      {!editing ? (
        <div className="space-y-1 text-sm">
          <p className="font-medium text-slate-800">{account.displayName || account.handle}</p>
          <p className="text-slate-500">{account.handle}</p>
          <p className="tabular-nums text-slate-700">
            {account.followers.toLocaleString("es-CO")} seguidores
          </p>
          {account.profileUrl && (
            <a
              href={account.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-brand"
            >
              <Link2 size={12} />
              Ver perfil
            </a>
          )}
          {account.notes && <p className="text-xs text-slate-500">{account.notes}</p>}
        </div>
      ) : (
        <form action={formAction} className="space-y-2.5">
          <input type="hidden" name="id" value={account.id} />
          <input type="hidden" name="companySlug" value={companySlug} />

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Usuario / handle
            </label>
            <input
              name="handle"
              defaultValue={account.handle}
              required
              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Nombre visible
            </label>
            <input
              name="displayName"
              defaultValue={account.displayName ?? ""}
              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">Estado</label>
              <select
                name="status"
                defaultValue={account.status}
                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              >
                <option value="PENDIENTE">Pendiente</option>
                <option value="CONECTADA">Conectada</option>
                <option value="DESCONECTADA">Desconectada</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-xs font-medium text-slate-600">Seguidores</label>
              <input
                name="followers"
                type="number"
                min={0}
                defaultValue={account.followers}
                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              URL del perfil
            </label>
            <input
              name="profileUrl"
              type="url"
              defaultValue={account.profileUrl ?? ""}
              placeholder="https://..."
              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">
              Token / clave de API (opcional, para conexion real)
            </label>
            <input
              name="accessToken"
              type="password"
              defaultValue={account.accessToken ?? ""}
              placeholder="Se guarda de forma privada"
              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Notas</label>
            <textarea
              name="notes"
              rows={2}
              defaultValue={account.notes ?? ""}
              className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
            />
          </div>

          {state?.error && (
            <p className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs text-red-600">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Guardar"}
          </button>
        </form>
      )}
    </div>
  );
}
