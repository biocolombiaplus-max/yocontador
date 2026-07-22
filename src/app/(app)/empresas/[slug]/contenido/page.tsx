import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import NewContentForm from "./new-content-form";
import ContentPostRow from "./content-post-row";

export default async function CompanyContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    include: {
      socialAccounts: { orderBy: { platform: "asc" } },
      contentPosts: {
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: { select: { name: true } },
          targets: { include: { socialAccount: { select: { platform: true } } } },
        },
      },
    },
  });
  if (!company) notFound();

  return (
    <div>
      <PageHeader
        title="Calendario de contenido"
        description="Imagenes, videos y reels de la empresa, listos para programar o publicar."
        action={
          <NewContentForm
            companyId={company.id}
            companySlug={slug}
            socialAccounts={company.socialAccounts}
          />
        }
      />

      <div className="space-y-3">
        {company.contentPosts.map((post) => (
          <ContentPostRow key={post.id} post={post} companySlug={slug} />
        ))}
        {company.contentPosts.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
            Aun no hay publicaciones. Crea la primera con &quot;Nueva publicacion&quot;.
          </p>
        )}
      </div>
    </div>
  );
}
