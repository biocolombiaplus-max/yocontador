import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card } from "@/components/ui";
import NewServiceForm from "./new-service-form";
import ServiceCard from "./service-card";

export default async function ServiciosPage() {
  const services = await prisma.serviceOffering.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { subscriptions: { where: { status: { not: "CANCELADO" } } } } } },
  });

  return (
    <div>
      <PageHeader
        title="Catalogo de servicios"
        description="Los servicios digitales que Bio Marketing ofrece a sus clientes, con logo e imagenes para la landing publica."
        action={
          <div className="flex items-center gap-2">
            <Link
              href="/landing"
              target="_blank"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Ver landing
              <ExternalLink size={14} />
            </Link>
            <NewServiceForm />
          </div>
        }
      />

      {services.length === 0 ? (
        <Card className="p-8 text-center text-sm text-slate-500">
          Aun no hay servicios en el catalogo. Crea el primero con &quot;Nuevo servicio&quot;.
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <ServiceCard
              key={s.id}
              service={{
                id: s.id,
                slug: s.slug,
                name: s.name,
                shortDescription: s.shortDescription,
                description: s.description,
                logoUrl: s.logoUrl,
                heroImageUrl: s.heroImageUrl,
                colorHex: s.colorHex,
                defaultPriceCOP: s.defaultPriceCOP,
                defaultPeriod: s.defaultPeriod,
                isPublished: s.isPublished,
                subscriptionsCount: s._count.subscriptions,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
