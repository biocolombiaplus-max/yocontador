import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { companyInitials } from "@/lib/initials";
import CompanyTabs from "./company-tabs";

export default async function CompanyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({ where: { slug } });
  if (!company) notFound();

  return (
    <div>
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-base font-bold text-white"
          style={{ backgroundColor: company.colorHex }}
        >
          {companyInitials(company.name)}
        </div>
        <div>
          <h1 className="text-xl font-semibold text-slate-900">{company.name}</h1>
          <p className="text-sm text-slate-500">{company.sector}</p>
        </div>
      </div>

      <CompanyTabs slug={slug} />

      <div className="mt-5">{children}</div>
    </div>
  );
}
