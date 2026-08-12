"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Globe, Pencil, X } from "lucide-react";
import { updateCompanyLogo, updateCompanyDetails } from "@/lib/actions/companies";
import { Card, Badge } from "@/components/ui";
import { companyInitials } from "@/lib/initials";

type Company = {
  id: string;
  slug: string;
  name: string;
  sector: string;
  description: string;
  colorHex: string;
  logoUrl: string | null;
  website: string | null;
  isActive: boolean;
};

export default function CompanyCard({
  company: c,
  connected,
  postsCount,
}: {
  company: Company;
  connected: number;
  postsCount: number;
}) {
  const [editing, setEditing] = useState(false);
  const [logoState, logoAction, logoPending] = useActionState(updateCompanyLogo, {});
  const [detailsState, detailsAction, detailsPending] = useActionState(updateCompanyDetails, {});

  return (
    <Card className="p-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg text-sm font-bold text-white"
            style={{ backgroundColor: c.colorHex }}
          >
            {c.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.logoUrl} alt={c.name} className="h-full w-full object-cover" />
            ) : (
              companyInitials(c.name)
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{c.name}</p>
            <p className="text-xs text-slate-500">{c.sector}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <Badge tone={c.isActive ? "success" : "neutral"}>{c.isActive ? "Activa" : "Inactiva"}</Badge>
          <button
            onClick={() => setEditing((v) => !v)}
            className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            {editing ? <X size={15} /> : <Pencil size={15} />}
          </button>
        </div>
      </div>

      <p className="mb-4 text-xs text-slate-600">{c.description}</p>

      <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
        <span>{connected}/4 redes conectadas</span>
        <span>{postsCount} publicaciones</span>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href={`/empresas/${c.slug}`}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-slate-800"
        >
          Administrar
          <ArrowUpRight size={13} />
        </Link>
        {c.website && (
          <a
            href={c.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50"
          >
            <Globe size={14} />
          </a>
        )}
      </div>

      {editing && (
        <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
          <form action={logoAction} className="space-y-2.5">
            <input type="hidden" name="companyId" value={c.id} />
            <input type="hidden" name="slug" value={c.slug} />
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Cambiar logo (imagen real de la empresa)
              </label>
              <input
                name="logo"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs"
              />
            </div>
            {logoState?.error && (
              <p className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs text-red-600">
                {logoState.error}
              </p>
            )}
            <button
              type="submit"
              disabled={logoPending}
              className="w-full rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {logoPending ? "Subiendo..." : "Actualizar logo"}
            </button>
          </form>

          <form action={detailsAction} className="space-y-2.5">
            <input type="hidden" name="companyId" value={c.id} />
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Sector</label>
              <input
                name="sector"
                defaultValue={c.sector}
                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-600">Descripcion</label>
              <textarea
                name="description"
                defaultValue={c.description}
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Sitio web / demo
                </label>
                <input
                  name="website"
                  type="url"
                  defaultValue={c.website ?? ""}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Color</label>
                <input
                  name="colorHex"
                  type="color"
                  defaultValue={c.colorHex}
                  className="h-[34px] w-11 rounded-lg border border-slate-200"
                />
              </div>
            </div>
            {detailsState?.error && (
              <p className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs text-red-600">
                {detailsState.error}
              </p>
            )}
            <button
              type="submit"
              disabled={detailsPending}
              className="w-full rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {detailsPending ? "Guardando..." : "Guardar detalles"}
            </button>
          </form>
        </div>
      )}
    </Card>
  );
}
