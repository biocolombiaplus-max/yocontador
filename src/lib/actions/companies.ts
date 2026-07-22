"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { requireSession } from "@/lib/session";

export type CompanyFormState = { error?: string; success?: boolean };

const PLATFORMS = ["FACEBOOK", "INSTAGRAM", "WHATSAPP", "TIKTOK"] as const;

export async function createCompany(
  _prevState: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  await requireSession();

  const name = formData.get("name")?.toString().trim() ?? "";
  const sector = formData.get("sector")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const colorHex = formData.get("colorHex")?.toString().trim() || "#0EA5A4";
  const website = formData.get("website")?.toString().trim() || null;

  if (!name || !sector || !description) {
    return { error: "Nombre, sector y descripcion son obligatorios." };
  }

  let slug = slugify(name);
  const existing = await prisma.company.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const count = await prisma.company.count();

  const company = await prisma.company.create({
    data: { name, sector, description, colorHex, website, slug, order: count },
  });

  await prisma.socialAccount.createMany({
    data: PLATFORMS.map((platform) => ({
      companyId: company.id,
      platform,
      handle: `@${slug}`,
      status: "PENDIENTE" as const,
    })),
  });

  revalidatePath("/empresas");
  revalidatePath("/");
  return { success: true };
}

export async function toggleCompanyActive(companyId: string) {
  await requireSession();
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  if (!company) return;
  await prisma.company.update({
    where: { id: companyId },
    data: { isActive: !company.isActive },
  });
  revalidatePath("/empresas");
}
