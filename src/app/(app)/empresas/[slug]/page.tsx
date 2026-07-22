import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, Badge } from "@/components/ui";
import { PLATFORM_META, SOCIAL_ACCOUNT_STATUS_META, CONTENT_STATUS_META } from "@/lib/constants";

export default async function CompanyOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      socialAccounts: true,
      contentPosts: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      activityLogs: {
        orderBy: { createdAt: "desc" },
        take: 6,
        include: { user: true },
      },
    },
  });
  if (!company) notFound();

  return (
    <div className="space-y-5">
      <Card className="p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-900">Sobre la empresa</h2>
        <p className="text-sm text-slate-600">{company.description}</p>
        {company.website && (
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-medium text-brand"
          >
            {company.website}
          </a>
        )}
      </Card>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-900">Redes sociales</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {company.socialAccounts.map((a) => {
            const meta = PLATFORM_META[a.platform];
            const statusMeta = SOCIAL_ACCOUNT_STATUS_META[a.status];
            return (
              <Card key={a.id} className="p-3.5">
                <div className="mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: meta.color }}
                    />
                    {meta.label}
                  </span>
                  <Badge tone={statusMeta.tone}>{statusMeta.label}</Badge>
                </div>
                <p className="text-lg font-semibold tabular-nums text-slate-900">
                  {a.followers.toLocaleString("es-CO")}
                </p>
                <p className="text-xs text-slate-500">seguidores &middot; {a.handle}</p>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Contenido reciente</h2>
          {company.contentPosts.length === 0 ? (
            <p className="text-sm text-slate-500">Aun no hay publicaciones registradas.</p>
          ) : (
            <ul className="space-y-2.5">
              {company.contentPosts.map((p) => (
                <li key={p.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">{p.title}</p>
                    <p className="text-xs text-slate-500">
                      {p.mediaType} &middot;{" "}
                      {new Date(p.createdAt).toLocaleDateString("es-CO")}
                    </p>
                  </div>
                  <Badge tone={CONTENT_STATUS_META[p.status].tone}>
                    {CONTENT_STATUS_META[p.status].label}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">Actividad reciente</h2>
          {company.activityLogs.length === 0 ? (
            <p className="text-sm text-slate-500">Sin actividad registrada todavia.</p>
          ) : (
            <ul className="space-y-2.5">
              {company.activityLogs.map((log) => (
                <li key={log.id} className="text-sm">
                  <p className="text-slate-700">
                    <span className="font-medium">{log.user?.name ?? "Sistema"}</span>{" "}
                    {log.detail ?? log.action}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(log.createdAt).toLocaleString("es-CO")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
