"use client";

import { useActionState, useState, useTransition } from "react";
import { Pencil, X, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { updateServiceDetails, updateServiceImages, toggleServicePublished } from "@/lib/actions/services";
import { Badge } from "@/components/ui";
import { formatCOP } from "@/lib/money";
import { BILLING_PERIOD_META } from "@/lib/constants";
import { companyInitials } from "@/lib/initials";

type Service = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  logoUrl: string | null;
  heroImageUrl: string | null;
  colorHex: string;
  defaultPriceCOP: number;
  defaultPeriod: keyof typeof BILLING_PERIOD_META;
  isPublished: boolean;
  subscriptionsCount: number;
};

export default function ServiceCard({ service }: { service: Service }) {
  const [editing, setEditing] = useState(false);
  const [detailsState, detailsAction, detailsPending] = useActionState(updateServiceDetails, {});
  const [imagesState, imagesAction, imagesPending] = useActionState(updateServiceImages, {});
  const [isPending, startTransition] = useTransition();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div
        className="flex h-28 items-center justify-center bg-cover bg-center"
        style={{
          backgroundColor: service.colorHex,
          backgroundImage: service.heroImageUrl ? `url(${service.heroImageUrl})` : undefined,
        }}
      >
        {!service.heroImageUrl && <ImageIcon className="text-white/60" size={28} />}
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50"
            style={!service.logoUrl ? { backgroundColor: service.colorHex } : undefined}
          >
            {service.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={service.logoUrl} alt={service.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-sm font-bold text-white">{companyInitials(service.name)}</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900">{service.name}</p>
            <p className="line-clamp-1 text-xs text-slate-500">{service.shortDescription}</p>
          </div>
          <button
            onClick={() => setEditing((v) => !v)}
            className="shrink-0 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            {editing ? <X size={15} /> : <Pencil size={15} />}
          </button>
        </div>

        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="font-medium tabular-nums text-slate-700">
            {formatCOP(service.defaultPriceCOP)} / {BILLING_PERIOD_META[service.defaultPeriod].label.toLowerCase()}
          </span>
          <Badge tone={service.isPublished ? "success" : "neutral"}>
            {service.isPublished ? "Publicado" : "Oculto"}
          </Badge>
        </div>

        <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
          <span>{service.subscriptionsCount} clientes activos</span>
          <button
            disabled={isPending}
            onClick={() => startTransition(() => toggleServicePublished(service.id))}
            className="flex items-center gap-1 font-medium text-brand hover:underline"
          >
            {service.isPublished ? <EyeOff size={12} /> : <Eye size={12} />}
            {service.isPublished ? "Ocultar de landing" : "Mostrar en landing"}
          </button>
        </div>

        {editing && (
          <div className="space-y-4 border-t border-slate-100 pt-4">
            <form action={detailsAction} className="space-y-2.5">
              <input type="hidden" name="serviceId" value={service.id} />
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Descripcion corta
                </label>
                <input
                  name="shortDescription"
                  defaultValue={service.shortDescription}
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Descripcion completa
                </label>
                <textarea
                  name="description"
                  defaultValue={service.description}
                  rows={2}
                  className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-slate-600">Precio</label>
                  <input
                    name="defaultPriceCOP"
                    type="number"
                    defaultValue={service.defaultPriceCOP}
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-slate-600">Periodo</label>
                  <select
                    name="defaultPeriod"
                    defaultValue={service.defaultPeriod}
                    className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
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
                    defaultValue={service.colorHex}
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

            <form action={imagesAction} className="space-y-2.5">
              <input type="hidden" name="serviceId" value={service.id} />
              <input type="hidden" name="slug" value={service.slug} />
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Cambiar logo
                </label>
                <input
                  name="logo"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml"
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Cambiar imagen de portada
                </label>
                <input
                  name="heroImage"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="w-full rounded-lg border border-slate-200 px-2 py-1.5 text-xs outline-none file:mr-2 file:rounded-md file:border-0 file:bg-slate-100 file:px-2 file:py-1 file:text-xs"
                />
              </div>
              {imagesState?.error && (
                <p className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs text-red-600">
                  {imagesState.error}
                </p>
              )}
              <button
                type="submit"
                disabled={imagesPending}
                className="w-full rounded-lg bg-brand px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-dark disabled:opacity-60"
              >
                {imagesPending ? "Subiendo..." : "Actualizar imagenes"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
