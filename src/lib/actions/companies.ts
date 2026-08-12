"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { requireSession } from "@/lib/session";
import { saveImage as saveImageToStorage, validateImage } from "@/lib/upload";

export type CompanyFormState = { error?: string; success?: boolean };

const PLATFORMS = ["FACEBOOK", "INSTAGRAM", "WHATSAPP", "TIKTOK"] as const;

function saveImage(file: File, folder: string): Promise<string> {
  return saveImageToStorage(file, "empresas", folder);
}

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
  const logo = formData.get("logo") as File | null;

  if (!name || !sector || !description) {
    return { error: "Nombre, sector y descripcion son obligatorios." };
  }

  const logoError = validateImage(logo);
  if (logoError) return { error: logoError };

  let slug = slugify(name);
  const existing = await prisma.company.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const logoUrl = logo && logo.size > 0 ? await saveImage(logo, slug) : null;
  const count = await prisma.company.count();

  const company = await prisma.company.create({
    data: { name, sector, description, colorHex, website, logoUrl, slug, order: count },
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
  revalidatePath("/landing");
  return { success: true };
}

export async function updateCompanyLogo(
  _prevState: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  await requireSession();

  const companyId = formData.get("companyId")?.toString();
  const slug = formData.get("slug")?.toString();
  if (!companyId || !slug) return { error: "Solicitud invalida." };

  const logo = formData.get("logo") as File | null;
  const logoError = validateImage(logo);
  if (logoError) return { error: logoError };
  if (!logo || logo.size === 0) return { error: "Selecciona una imagen." };

  const logoUrl = await saveImage(logo, slug);
  await prisma.company.update({ where: { id: companyId }, data: { logoUrl } });

  revalidatePath("/empresas");
  revalidatePath("/");
  revalidatePath("/landing");
  return { success: true };
}

export async function updateCompanyDetails(
  _prevState: CompanyFormState,
  formData: FormData
): Promise<CompanyFormState> {
  await requireSession();

  const companyId = formData.get("companyId")?.toString();
  if (!companyId) return { error: "Solicitud invalida." };

  const sector = formData.get("sector")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const colorHex = formData.get("colorHex")?.toString().trim() || "#0EA5A4";
  const website = formData.get("website")?.toString().trim() || null;

  if (!sector || !description) {
    return { error: "Sector y descripcion son obligatorios." };
  }

  await prisma.company.update({
    where: { id: companyId },
    data: { sector, description, colorHex, website },
  });

  revalidatePath("/empresas");
  revalidatePath("/");
  revalidatePath("/landing");
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
