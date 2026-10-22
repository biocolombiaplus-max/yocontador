"use client";

import { useState, useTransition } from "react";
import { MessageCircle, CheckCircle2, Clock } from "lucide-react";
import { sendWhatsAppReminderAction } from "@/lib/actions/reminders";

export default function WhatsAppChargeButton({
  subscriptionId,
  dueSoon,
  sentToday,
}: {
  subscriptionId: string;
  dueSoon: boolean;
  sentToday: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [sent, setSent] = useState(sentToday);
  const [error, setError] = useState<string | null>(null);

  if (!dueSoon) {
    return (
      <span className="flex items-center gap-1.5 rounded-lg border border-dashed border-slate-200 px-3 py-1.5 text-xs text-slate-400">
        <Clock size={13} />
        Cobro no activo aun
      </span>
    );
  }

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await sendWhatsAppReminderAction(subscriptionId);
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.whatsappUrl) {
        window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
        setSent(true);
      }
    });
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleClick}
        disabled={isPending}
        className={
          sent
            ? "flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-100"
            : "flex items-center gap-1.5 rounded-lg bg-[#25D366] px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:opacity-90 disabled:opacity-60"
        }
      >
        {sent ? <CheckCircle2 size={14} /> : <MessageCircle size={14} />}
        {isPending ? "Enviando..." : sent ? "Enviado hoy - reenviar" : "Enviar cobro por WhatsApp"}
      </button>
      {error && <p className="text-[11px] text-red-600">{error}</p>}
    </div>
  );
}
