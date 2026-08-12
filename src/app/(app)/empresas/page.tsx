import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/ui";
import NewCompanyForm from "./new-company-form";
import CompanyCard from "./company-card";

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
            <CompanyCard
              key={c.id}
              company={c}
              connected={connected}
              postsCount={c._count.contentPosts}
            />
          );
        })}
      </div>
    </div>
  );
}
