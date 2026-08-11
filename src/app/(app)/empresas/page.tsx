import Link from "next/link";
import { ArrowUpRight, Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, Badge } from "@/components/ui";
import { companyInitials } from "@/lib/initials";
import NewCompanyForm from "./new-company-form";

export default async function EmpresasPage() {
  const companies = await prisma.company.findMany({
    orderBy: { order: "asc" },
    include: { socialAccounts: true, _count: { select: { contentPosts: true } } },
  });

  return (
    <div>
      <PageHeader
        title="Todas las empresas"
        description="Administra las empresas del grupo Bio Marketing desde un solo lugar."
        action={<NewCompanyForm />}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((c) => {
          const connected = c.socialAccounts.filter((a) => a.status === "CONECTADA").length;
          return (
            <Card key={c.id} className="p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                    style={{ backgroundColor: c.colorHex }}
                  >
                    {companyInitials(c.name)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.sector}</p>
                  </div>
                </div>
                <Badge tone={c.isActive ? "success" : "neutral"}>
                  {c.isActive ? "Activa" : "Inactiva"}
                </Badge>
              </div>

              <p className="mb-4 text-xs text-slate-600">{c.description}</p>

              <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
                <span>{connected}/4 redes conectadas</span>
                <span>{c._count.contentPosts} publicaciones</span>
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
            </Card>
          );
        })}
      </div>
    </div>
  );
}
