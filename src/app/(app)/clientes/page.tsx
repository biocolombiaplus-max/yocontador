import Link from "next/link";
import { Search, ArrowUpRight, Mail, Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, Badge } from "@/components/ui";
import { SUBSCRIPTION_STATUS_META } from "@/lib/constants";
import NewClientForm from "./new-client-form";

const STATUS_PRIORITY: Record<string, number> = {
  SUSPENDIDO: 0,
  PENDIENTE: 1,
  AL_DIA: 2,
  CANCELADO: 3,
};

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const clients = await prisma.client.findMany({
    where: q
      ? {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
            { companyName: { contains: q, mode: "insensitive" } },
          ],
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      subscriptions: {
        where: { status: { not: "CANCELADO" } },
        include: { service: true },
      },
    },
  });

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Todas las empresas y personas que contratan servicios de Bio Marketing."
        action={<NewClientForm />}
      />

      <form className="mb-5">
        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por nombre, correo o empresa..."
            className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </form>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => {
          const worstStatus = client.subscriptions.reduce<string | null>((worst, sub) => {
            if (!worst) return sub.status;
            return STATUS_PRIORITY[sub.status] < STATUS_PRIORITY[worst] ? sub.status : worst;
          }, null);
          const statusMeta = worstStatus
            ? SUBSCRIPTION_STATUS_META[worstStatus as keyof typeof SUBSCRIPTION_STATUS_META]
            : null;

          return (
            <Link key={client.id} href={`/clientes/${client.id}`}>
              <Card className="h-full p-4 transition hover:border-brand/40 hover:shadow-md">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {client.firstName} {client.lastName}
                    </p>
                    {client.companyName && (
                      <p className="text-xs text-slate-500">{client.companyName}</p>
                    )}
                  </div>
                  {statusMeta ? (
                    <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                  ) : (
                    <Badge tone="neutral">Sin servicios</Badge>
                  )}
                </div>

                <div className="mb-3 space-y-1 text-xs text-slate-500">
                  <p className="flex items-center gap-1.5 truncate">
                    <Mail size={12} className="shrink-0" />
                    {client.email}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone size={12} className="shrink-0" />
                    {client.phone}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <span className="text-slate-500">
                    {client.subscriptions.length}{" "}
                    {client.subscriptions.length === 1 ? "servicio activo" : "servicios activos"}
                  </span>
                  <ArrowUpRight size={14} className="text-slate-400" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {clients.length === 0 && (
        <Card className="p-8 text-center text-sm text-slate-500">
          {q ? "No se encontraron clientes con esa busqueda." : "Aun no hay clientes registrados."}
        </Card>
      )}
    </div>
  );
}
