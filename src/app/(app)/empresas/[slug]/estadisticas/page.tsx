import { notFound } from "next/navigation";
import { Users, TrendingUp, Eye, FileImage } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui";
import { StatTile } from "@/components/stat-tile";
import FollowersTrendChart, { type TrendPoint } from "@/components/charts/followers-trend-chart";
import PlatformBarChart, { type PlatformBarPoint } from "@/components/charts/platform-bar-chart";
import { PLATFORM_META } from "@/lib/constants";

export default async function CompanyStatsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { socialAccounts: true },
  });
  if (!company) notFound();

  const snapshots = await prisma.statSnapshot.findMany({
    where: { companyId: company.id },
    orderBy: { date: "asc" },
  });

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

  const barData: PlatformBarPoint[] = company.socialAccounts.map((a) => ({
    platform: PLATFORM_META[a.platform].label,
    followers: a.followers,
    color: PLATFORM_META[a.platform].color,
  }));

  const totalFollowers = company.socialAccounts.reduce((s, a) => s + a.followers, 0);
  const avgEngagement = snapshots.length
    ? snapshots.reduce((s, x) => s + x.engagementRate, 0) / snapshots.length
    : 0;
  const totalReach = snapshots.reduce((s, x) => s + x.reach, 0);
  const totalPosts = snapshots.reduce((s, x) => s + x.postsCount, 0);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Seguidores totales" value={totalFollowers.toLocaleString("es-CO")} icon={Users} />
        <StatTile label="Engagement promedio" value={`${avgEngagement.toFixed(1)}%`} icon={TrendingUp} />
        <StatTile label="Alcance acumulado" value={totalReach.toLocaleString("es-CO")} icon={Eye} />
        <StatTile label="Publicaciones (historico)" value={totalPosts} icon={FileImage} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-4 lg:col-span-2">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">
            Crecimiento de seguidores (12 semanas)
          </h2>
          {trend.length > 0 ? (
            <FollowersTrendChart data={trend} />
          ) : (
            <p className="py-10 text-center text-sm text-slate-500">
              Aun no hay datos historicos para esta empresa.
            </p>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="mb-2 text-sm font-semibold text-slate-900">Seguidores por red</h2>
          <PlatformBarChart data={barData} />
        </Card>
      </div>

      <Card className="p-4">
        <p className="text-xs text-slate-500">
          Estas estadisticas se alimentan hoy con datos de referencia. Al conectar las cuentas
          reales de Facebook, Instagram, WhatsApp y TikTok en la pestana{" "}
          <span className="font-medium text-slate-700">Redes sociales</span>, este panel podra
          sincronizarse con las metricas oficiales de cada plataforma.
        </p>
      </Card>
    </div>
  );
}
