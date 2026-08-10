"use client";

import { useTransition } from "react";
import { MessageCircle, Ban } from "lucide-react";
import { cancelSubscription } from "@/lib/actions/subscriptions";
import { Badge } from "@/components/ui";
import { formatCOP } from "@/lib/money";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { SUBSCRIPTION_STATUS_META, BILLING_PERIOD_META } from "@/lib/constants";
import RegisterPaymentForm from "./register-payment-form";

type Subscription = {
  id: string;
  serviceName: string;
  priceCOP: number;
  period: keyof typeof BILLING_PERIOD_META;
  status: keyof typeof SUBSCRIPTION_STATUS_META;
  renewalDate: Date;
};

export default function SubscriptionRow({
  subscription,
  clientId,
  clientFirstName,
  clientPhone,
}: {
  subscription: Subscription;
  clientId: string;
  clientFirstName: string;
  clientPhone: string;
}) {
  const [isPending, startTransition] = useTransition();
  const statusMeta = SUBSCRIPTION_STATUS_META[subscription.status];
  const whatsappUrl = buildWhatsAppLink(
    clientPhone,
    `Hola ${clientFirstName}, te escribe Bio Marketing sobre tu servicio ${subscription.serviceName}.`
  );

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <p className="font-medium text-slate-900">{subscription.serviceName}</p>
          <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
        </div>
        <p className="text-sm text-slate-500">
          {formatCOP(subscription.priceCOP)} / {BILLING_PERIOD_META[subscription.period].label.toLowerCase()}{" "}
          &middot; renueva {new Date(subscription.renewalDate).toLocaleDateString("es-CO")}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
        >
          <MessageCircle size={14} className="text-[#25D366]" />
          WhatsApp
        </a>
        {subscription.status !== "CANCELADO" && (
          <RegisterPaymentForm
            subscriptionId={subscription.id}
            clientId={clientId}
            serviceName={subscription.serviceName}
            suggestedAmount={subscription.priceCOP}
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
