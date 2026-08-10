import { notFound } from "next/navigation";
import { Mail, Phone, Building2, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader, Badge } from "@/components/ui";
import { formatCOP } from "@/lib/money";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { PAYMENT_METHOD_META } from "@/lib/constants";
import NewSubscriptionForm from "./new-subscription-form";
import SubscriptionRow from "./subscription-row";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      subscriptions: {
        orderBy: { createdAt: "desc" },
        include: {
          service: true,
          payments: { orderBy: { paidAt: "desc" } },
        },
      },
    },
  });
  if (!client) notFound();

  const services = await prisma.serviceOffering.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: { id: true, name: true, defaultPriceCOP: true, defaultPeriod: true, reconnectionFeeCOP: true },
  });

  const allPayments = client.subscriptions
    .flatMap((s) => s.payments.map((p) => ({ ...p, serviceName: s.service.name })))
    .sort((a, b) => b.paidAt.getTime() - a.paidAt.getTime());

  const whatsappUrl = buildWhatsAppLink(client.phone, `Hola ${client.firstName}, te escribe Bio Marketing.`);

  return (
    <div>
      <PageHeader
        title={`${client.firstName} ${client.lastName}`}
        description={client.companyName ?? undefined}
      />

      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-1">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Contacto</h2>
          <div className="space-y-2.5 text-sm">
            <p className="flex items-center gap-2 text-slate-600">
              <Mail size={14} className="shrink-0 text-slate-400" />
              <span className="truncate">{client.email}</span>
            </p>
            <p className="flex items-center gap-2 text-slate-600">
              <Phone size={14} className="shrink-0 text-slate-400" />
              {client.phone}
            </p>
            {client.companyName && (
              <p className="flex items-center gap-2 text-slate-600">
                <Building2 size={14} className="shrink-0 text-slate-400" />
                {client.companyName}
              </p>
            )}
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            <MessageCircle size={16} />
            Escribir por WhatsApp
          </a>
          {client.notes && (
            <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs text-slate-600">{client.notes}</div>
          )}
        </Card>

        <Card className="p-4 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Historial de pagos</h2>
          {allPayments.length === 0 ? (
            <p className="text-sm text-slate-500">Aun no hay pagos registrados.</p>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 border-b border-slate-200 bg-white text-left text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="py-2 pr-2 font-medium">Fecha</th>
                    <th className="py-2 pr-2 font-medium">Servicio</th>
                    <th className="py-2 pr-2 font-medium">Metodo</th>
                    <th className="py-2 text-right font-medium">Monto</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allPayments.map((p) => (
                    <tr key={p.id}>
                      <td className="py-2 pr-2 text-slate-500">
                        {new Date(p.paidAt).toLocaleDateString("es-CO")}
                      </td>
                      <td className="py-2 pr-2 text-slate-700">{p.serviceName}</td>
                      <td className="py-2 pr-2">
                        <Badge tone="neutral">{PAYMENT_METHOD_META[p.method].label}</Badge>
                      </td>
                      <td className="py-2 text-right font-medium tabular-nums text-emerald-700">
                        {formatCOP(p.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-900">Servicios contratados</h2>
        <NewSubscriptionForm clientId={client.id} services={services} />
      </div>

      <div className="space-y-3">
        {client.subscriptions.map((sub) => (
          <SubscriptionRow
            key={sub.id}
            subscription={{
              id: sub.id,
              serviceName: sub.service.name,
              priceCOP: sub.priceCOP,
              period: sub.period,
              status: sub.status,
              renewalDate: sub.renewalDate,
            }}
            clientId={client.id}
            clientFirstName={client.firstName}
            clientPhone={client.phone}
          />
        ))}
        {client.subscriptions.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Este cliente aun no tiene servicios asignados.
          </p>
        )}
      </div>
    </div>
  );
}
