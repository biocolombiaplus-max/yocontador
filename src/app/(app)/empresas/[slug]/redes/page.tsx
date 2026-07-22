import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui";
import SocialAccountCard from "./social-account-card";

export default async function CompanySocialPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { socialAccounts: { orderBy: { platform: "asc" } } },
  });
  if (!company) notFound();

  return (
    <div className="space-y-4">
      <Card className="border-brand/20 bg-brand/5 p-4">
        <p className="text-sm text-slate-700">
          Aqui puedes organizar las cuentas de Facebook, Instagram, WhatsApp y TikTok de{" "}
          <span className="font-medium">{company.name}</span>. Para publicar contenido de verdad
          en cada red necesitas conectar sus credenciales oficiales (API de Meta Business y
          TikTok for Business); mientras tanto puedes dejar la cuenta en estado{" "}
          <span className="font-medium">Pendiente</span> y seguir organizando el contenido.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {company.socialAccounts.map((a) => (
          <SocialAccountCard key={a.id} account={a} companySlug={slug} />
        ))}
      </div>
    </div>
  );
}
