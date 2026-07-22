import Link from "next/link";
import { Building2, Users, Image as ImageIcon, CalendarClock, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader, Card, Badge } from "@/components/ui";
import { StatTile } from "@/components/stat-tile";
import FollowersTrendChart, { type TrendPoint } from "@/components/charts/followers-trend-chart";
import { companyInitials } from "@/lib/initials";

export default async function DashboardHome() {
  const [companies, connectedAccounts, scheduledPosts, publishedThisMonth, snapshots] =
    await Promise.all([
      prisma.company.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        include: {
          socialAccounts: true,
          _count: { select: { contentPosts: true } },
        },
      }),
      prisma.socialAccount.count({ where: { status: "CONECTADA" } }),
      prisma.contentPost.count({ where: { status: "PROGRAMADO" } }),
      prisma.contentPost.count({
        where: {
          status: "PUBLICADO",
          publishedAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
        },
      }),
      prisma.statSnapshot.findMany({
        orderBy: { date: "asc" },
      }),
    ]);

  const byDate = new Map<string, { facebook: number; instagram: number }>();
  for (const s of snapshots) {
    const key = s.date.toISOString().slice(0, 10);
    const entry = byDate.get(key) ?? { facebook: 0, instagram: 0 };
    if (s.platform === "FACEBOOK") entry.facebook += s.followers;
    if (s.platform === "INSTAGRAM") entry.instagram += s.followers;
    byDate.set(key, entry);
  }
  const trend: TrendPoint[] = Array.from(byDate.entries()).map(([date, v]) => ({
    label: new Date(date).toLocaleDateString("es-CO", { day: "2-digit", month: "short" }),
    ...v,
  }));

  const totalFollowers = companies.reduce(
    (sum, c) => sum + c.socialAccounts.reduce((s, a) => s + a.followers, 0),
    0
  );

  return (
    <div>
      <PageHeader
        title="Resumen general"
        description="Vision consolidada de todas las empresas del grupo BIO COLOMBIA."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Empresas activas" value={companies.length} icon={Building2} />
        <StatTile
          label="Cuentas conectadas"
          value={connectedAccounts}
          icon={Users}
          hint={`de ${companies.length * 4} posibles`}
        />
        <StatTile label="Programados" value={scheduledPosts} icon={CalendarClock} />
        <StatTile label="Publicados este mes" value={publishedThisMonth} icon={ImageIcon} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Crecimiento de seguidores (consolidado)
              </h2>
              <p className="text-xs text-slate-500">Facebook e Instagram, ultimas 12 semanas</p>
            </div>
          </div>
          <FollowersTrendChart data={trend} />
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Seguidores totales</h2>
          <p className="text-3xl font-semibold tabular-nums text-slate-900">
            {totalFollowers.toLocaleString("es-CO")}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Suma de todas las cuentas y plataformas del grupo.
          </p>
          <div className="mt-4 space-y-2">
            {companies.map((c) => {
              const followers = c.socialAccounts.reduce((s, a) => s + a.followers, 0);
              return (
                <div key={c.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: c.colorHex }}
                    />
                    <span className="text-slate-700">{c.name}</span>
                  </div>
                  <span className="font-medium tabular-nums text-slate-900">
                    {followers.toLocaleString("es-CO")}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <h2 className="mb-3 text-sm font-semibold text-slate-900">Empresas</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((c) => {
          const connected = c.socialAccounts.filter((a) => a.status === "CONECTADA").length;
          const followers = c.socialAccounts.reduce((s, a) => s + a.followers, 0);
          return (
            <Link key={c.id} href={`/empresas/${c.slug}`}>
              <Card className="h-full p-4 transition hover:border-brand/40 hover:shadow-md">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: c.colorHex }}
                    >
                      {companyInitials(c.name)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{c.name}</p>
                      <p className="text-xs text-slate-500">{c.sector}</p>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-slate-400" />
                </div>
                <p className="mb-3 line-clamp-2 text-xs text-slate-500">{c.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <Badge tone={connected > 0 ? "success" : "neutral"}>
                    {connected}/4 redes conectadas
                  </Badge>
                  <span className="font-medium text-slate-700">
                    {followers.toLocaleString("es-CO")} seguidores
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {companies.length === 0 && (
        <Card className="p-8 text-center text-sm text-slate-500">
          Aun no hay empresas registradas.{" "}
          <Link href="/empresas" className="font-medium text-brand">
            Agrega la primera empresa
          </Link>
          .
        </Card>
      )}
    </div>
  );
}
