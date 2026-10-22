"use client";

import { useActionState, useTransition } from "react";
import { Ban, TrendingUp } from "lucide-react";
import { cancelSubscription, updatePendingSalesBasis } from "@/lib/actions/subscriptions";
import { Badge } from "@/components/ui";
import { formatMoney } from "@/lib/money";
import { computeChargeAmount, type BillingType, type Currency } from "@/lib/crm/billing";
import { SUBSCRIPTION_STATUS_META, BILLING_PERIOD_META } from "@/lib/constants";
import RegisterPaymentForm from "./register-payment-form";
import WhatsAppChargeButton from "../whatsapp-charge-button";

type Subscription = {
  id: string;
  conceptName: string;
  currency: Currency;
  priceCOP: number;
  priceUSD: number | null;
  billingType: BillingType;
  commissionRate: number | null;
  valorPorVenta: number | null;
  pendingSalesBasis: number | null;
  period: keyof typeof BILLING_PERIOD_META;
  status: keyof typeof SUBSCRIPTION_STATUS_META;
  renewalDate: Date;
  whatsappSentToday: boolean;
};

const BILLING_TYPE_LABEL: Record<BillingType, string> = {
  FIJO: "Fijo",
  PORCENTAJE_VENTA: "% de ventas",
  VALOR_POR_VENTA: "Valor por venta",
};

function daysUntil(date: Date): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

export default function SubscriptionRow({
  subscription,
  clientId,
}: {
  subscription: Subscription;
  clientId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const statusMeta = SUBSCRIPTION_STATUS_META[subscription.status];
  const charge = computeChargeAmount(subscription);
  const diff = daysUntil(subscription.renewalDate);
  const dueSoon = subscription.status !== "CANCELADO" && diff <= 3;
  const billingLabel = BILLING_TYPE_LABEL[subscription.billingType];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <p className="font-medium text-slate-900">{subscription.conceptName}</p>
          <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
          {subscription.billingType !== "FIJO" && <Badge tone="info">{billingLabel}</Badge>}
          {subscription.currency === "USD" && <Badge tone="neutral">USD</Badge>}
        </div>
        <p className="text-sm text-slate-500">
          {charge.ready ? (
            formatMoney(charge.amount, charge.currency)
          ) : (
            <span className="text-amber-600">Falta ingresar ventas del periodo</span>
          )}{" "}
          / {BILLING_PERIOD_META[subscription.period].label.toLowerCase()} &middot; renueva{" "}
          {new Date(subscription.renewalDate).toLocaleDateString("es-CO")}
          {dueSoon && subscription.status !== "CANCELADO" && (
            <span className="ml-1 font-medium text-amber-600">
              ({diff < 0 ? `vencido hace ${Math.abs(diff)} dia(s)` : diff === 0 ? "vence hoy" : `vence en ${diff} dias`})
            </span>
          )}
        </p>

        {subscription.billingType !== "FIJO" && subscription.status !== "CANCELADO" && (
          <SalesBasisForm
            subscriptionId={subscription.id}
            clientId={clientId}
            billingType={subscription.billingType}
            currentValue={subscription.pendingSalesBasis}
          />
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <WhatsAppChargeButton
          key={`${charge.ready}-${charge.amount}`}
          subscriptionId={subscription.id}
          dueSoon={dueSoon}
          sentToday={subscription.whatsappSentToday}
        />
        {subscription.status !== "CANCELADO" && (
          <RegisterPaymentForm
            subscriptionId={subscription.id}
            clientId={clientId}
            serviceName={subscription.conceptName}
            suggestedAmount={charge.amount}
            currency={subscription.currency}
          />
        )}
        {subscription.status !== "CANCELADO" && (
          <button
            disabled={isPending}
            onClick={() => startTransition(() => cancelSubscription(subscription.id, clientId))}
            className="flex items-center gap-1.5 rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
            aria-label="Cancelar servicio"
            title="Cancelar servicio"
          >
            <Ban size={15} />
          </button>
        )}
      </div>
    </div>
  );
}

function SalesBasisForm({
  subscriptionId,
  clientId,
  billingType,
  currentValue,
}: {
  subscriptionId: string;
  clientId: string;
  billingType: BillingType;
  currentValue: number | null;
}) {
  const [state, formAction, pending] = useActionState(updatePendingSalesBasis, {});
  const label =
    billingType === "PORCENTAJE_VENTA" ? "Ventas del periodo (COP)" : "Unidades vendidas en el periodo";

  return (
    <form action={formAction} className="mt-2 flex flex-wrap items-center gap-2">
      <input type="hidden" name="subscriptionId" value={subscriptionId} />
      <input type="hidden" name="clientId" value={clientId} />
      <TrendingUp size={13} className="text-slate-400" />
      <label className="text-[11px] text-slate-500">{label}</label>
      <input
        name="pendingSalesBasis"
        type="number"
        min={1}
        defaultValue={currentValue ?? ""}
        placeholder="0"
        className="w-28 rounded-lg border border-slate-200 px-2 py-1 text-xs outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-slate-700 disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar"}
      </button>
      {state?.error && <span className="text-[11px] text-red-600">{state.error}</span>}
      {state?.success && <span className="text-[11px] text-emerald-600">Guardado</span>}
    </form>
  );
}
