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

type ConceptMode = "catalogo" | "personalizado";
type BillingType = "FIJO" | "PORCENTAJE_VENTA" | "VALOR_POR_VENTA";

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
  const [mode, setMode] = useState<ConceptMode>(services.length > 0 ? "catalogo" : "personalizado");
  const [selectedService, setSelectedService] = useState<Service | undefined>(services[0]);
  const [currency, setCurrency] = useState<"COP" | "USD">("COP");
  const [billingType, setBillingType] = useState<BillingType>("FIJO");
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpen(false);
      setMode(services.length > 0 ? "catalogo" : "personalizado");
      setCurrency("COP");
      setBillingType("FIJO");
    }
  }, [state?.success, services.length]);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-brand px-3.5 py-2 text-sm font-medium text-white transition hover:bg-brand-dark"
      >
        <Plus size={15} />
        Agregar cobro
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl bg-white p-5 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">Agregar cobro</h2>
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        <form ref={formRef} action={formAction} className="space-y-3">
          <input type="hidden" name="clientId" value={clientId} />

          {services.length > 0 && (
            <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setMode("catalogo")}
                className={`flex-1 rounded-md py-1.5 transition ${
                  mode === "catalogo" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                Servicio del catalogo
              </button>
              <button
                type="button"
                onClick={() => setMode("personalizado")}
                className={`flex-1 rounded-md py-1.5 transition ${
                  mode === "personalizado" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                Concepto personalizado
              </button>
            </div>
          )}

          {mode === "catalogo" ? (
            <>
              <input type="hidden" name="currency" value="COP" />
              <input type="hidden" name="billingType" value="FIJO" />
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
                    name="amount"
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
            </>
          ) : (
            <>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Concepto (ej. Hosting Shopify, Comision campana Meta Ads)
                </label>
                <input
                  name="conceptName"
                  required
                  placeholder="Describe el cobro"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-slate-600">Moneda</label>
                  <select
                    name="currency"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value as "COP" | "USD")}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                  >
                    <option value="COP">COP (pesos)</option>
                    <option value="USD">USD (dolares)</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs font-medium text-slate-600">Periodo</label>
                  <select
                    name="period"
                    defaultValue="MENSUAL"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                  >
                    <option value="MENSUAL">Mensual</option>
                    <option value="ANUAL">Anual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">Tipo de cobro</label>
                <select
                  name="billingType"
                  value={billingType}
                  onChange={(e) => setBillingType(e.target.value as BillingType)}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                >
                  <option value="FIJO">Valor fijo recurrente</option>
                  <option value="PORCENTAJE_VENTA">% de las ventas del periodo</option>
                  <option value="VALOR_POR_VENTA">Valor fijo por cada venta</option>
                </select>
              </div>

              {billingType === "FIJO" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Precio acordado ({currency})
                  </label>
                  <input
                    name="amount"
                    type="number"
                    min={currency === "USD" ? 0.01 : 1}
                    step={currency === "USD" ? "0.01" : "1"}
                    required
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                  />
                </div>
              )}

              {billingType === "PORCENTAJE_VENTA" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Porcentaje de comision (%)
                  </label>
                  <input
                    name="commissionRate"
                    type="number"
                    min={0}
                    max={100}
                    step="0.1"
                    required
                    placeholder="Ej. 10"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Cada mes ingresas el total vendido (COP) y el sistema calcula el cobro.
                  </p>
                </div>
              )}

              {billingType === "VALOR_POR_VENTA" && (
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-600">
                    Valor por venta (COP)
                  </label>
                  <input
                    name="valorPorVenta"
                    type="number"
                    min={1}
                    required
                    placeholder="Ej. 2000"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                  />
                  <p className="mt-1 text-[11px] text-slate-400">
                    Cada mes ingresas las unidades vendidas y el sistema calcula el cobro.
                  </p>
                </div>
              )}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Cargo de reconexion (COP, opcional)
                </label>
                <input
                  name="reconnectionFeeCOP"
                  type="number"
                  min={0}
                  defaultValue={0}
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
                />
              </div>
            </>
          )}

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

          {state?.error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{state.error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
          >
            {pending ? "Guardando..." : "Agregar cobro"}
          </button>
        </form>
      </div>
    </div>
  );
}
