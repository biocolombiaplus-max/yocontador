import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { formatMoney } from "@/lib/money";
import WhatsAppChargeButton from "./whatsapp-charge-button";

export type PendingCharge = {
  subscriptionId: string;
  clientId: string;
  clientName: string;
  concept: string;
  amount: number;
  currency: "COP" | "USD";
  chargeReady: boolean;
  diff: number;
  whatsappSentToday: boolean;
};

export default function PendingChargesPanel({ items }: { items: PendingCharge[] }) {
  if (items.length === 0) {
    return (
      <Card className="mb-5 flex items-center gap-3 p-4 text-sm text-emerald-700">
        <CheckCircle2 size={18} className="shrink-0" />
        Todo al dia: no hay cobros por vencer en los proximos 3 dias.
      </Card>
    );
  }

  return (
    <Card className="mb-5 overflow-hidden">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-amber-50 px-4 py-3">
        <AlertTriangle size={16} className="text-amber-600" />
        <h2 className="text-sm font-semibold text-amber-900">
          Cobros por vencer o vencidos ({items.length})
        </h2>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map((item) => (
          <div
            key={item.subscriptionId}
            className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <Link
                href={`/clientes/${item.clientId}`}
                className="font-medium text-slate-900 hover:text-brand"
              >
                {item.clientName}
              </Link>
              <p className="text-sm text-slate-500">
                {item.concept} &middot;{" "}
                {item.chargeReady ? (
                  <span className="font-medium">{formatMoney(item.amount, item.currency)}</span>
                ) : (
                  <span className="text-amber-600">falta ingresar ventas del periodo</span>
                )}
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Badge tone={item.diff < 0 ? "danger" : "warning"}>
                {item.diff < 0 ? `vencido hace ${Math.abs(item.diff)}d` : item.diff === 0 ? "vence hoy" : `${item.diff}d`}
              </Badge>
              <WhatsAppChargeButton
                key={`${item.chargeReady}-${item.amount}`}
                subscriptionId={item.subscriptionId}
                dueSoon
                sentToday={item.whatsappSentToday}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
