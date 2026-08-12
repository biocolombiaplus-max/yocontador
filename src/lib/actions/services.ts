"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { slugify } from "@/lib/slug";
import { saveImage as saveImageToStorage, validateImage } from "@/lib/upload";

export type ServiceFormState = { error?: string; success?: boolean };

function saveImage(file: File, folder: string): Promise<string> {
  return saveImageToStorage(file, "servicios", folder);
}

export async function createService(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireSession();

  const name = formData.get("name")?.toString().trim() ?? "";
  const shortDescription = formData.get("shortDescription")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const colorHex = formData.get("colorHex")?.toString().trim() || "#7C3AED";
  const defaultPriceCOP = Math.round(Number(formData.get("defaultPriceCOP")));
  const defaultPeriod = (formData.get("defaultPeriod")?.toString() || "MENSUAL") as "MENSUAL" | "ANUAL";
  const reconnectionFeeCOP = Math.round(Number(formData.get("reconnectionFeeCOP")) || 50000);
  const logo = formData.get("logo") as File | null;
  const heroImage = formData.get("heroImage") as File | null;

  if (!name || !shortDescription || !description) {
    return { error: "Nombre, descripcion corta y descripcion son obligatorios." };
  }
  if (!defaultPriceCOP || defaultPriceCOP <= 0) {
    return { error: "El precio debe ser mayor a cero." };
  }

  const logoError = validateImage(logo);
  if (logoError) return { error: logoError };
  const heroError = validateImage(heroImage);
  if (heroError) return { error: heroError };

  let slug = slugify(name);
  const existing = await prisma.serviceOffering.findUnique({ where: { slug } });
  if (existing) slug = `${slug}-${Date.now().toString(36)}`;

  const logoUrl = logo && logo.size > 0 ? await saveImage(logo, slug) : null;
  const heroImageUrl = heroImage && heroImage.size > 0 ? await saveImage(heroImage, slug) : null;

  const count = await prisma.serviceOffering.count();

  await prisma.serviceOffering.create({
    data: {
      name,
      slug,
      shortDescription,
      description,
      colorHex,
      defaultPriceCOP,
      defaultPeriod,
      reconnectionFeeCOP,
      logoUrl,
      heroImageUrl,
      order: count,
    },
  });

  revalidatePath("/servicios");
  revalidatePath("/landing");
  return { success: true };
}

export async function updateServiceImages(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireSession();

  const serviceId = formData.get("serviceId")?.toString();
  const slug = formData.get("slug")?.toString();
  if (!serviceId || !slug) return { error: "Solicitud invalida." };

  const logo = formData.get("logo") as File | null;
  const heroImage = formData.get("heroImage") as File | null;

  const logoError = validateImage(logo);
  if (logoError) return { error: logoError };
  const heroError = validateImage(heroImage);
  if (heroError) return { error: heroError };

  const data: { logoUrl?: string; heroImageUrl?: string } = {};
  if (logo && logo.size > 0) data.logoUrl = await saveImage(logo, slug);
  if (heroImage && heroImage.size > 0) data.heroImageUrl = await saveImage(heroImage, slug);

  if (Object.keys(data).length === 0) {
    return { error: "Selecciona al menos una imagen para actualizar." };
  }

  await prisma.serviceOffering.update({ where: { id: serviceId }, data });

  revalidatePath("/servicios");
  revalidatePath("/landing");
  return { success: true };
}

export async function updateServiceDetails(
  _prevState: ServiceFormState,
  formData: FormData
): Promise<ServiceFormState> {
  await requireSession();

  const serviceId = formData.get("serviceId")?.toString();
  if (!serviceId) return { error: "Solicitud invalida." };

  const shortDescription = formData.get("shortDescription")?.toString().trim() ?? "";
  const description = formData.get("description")?.toString().trim() ?? "";
  const colorHex = formData.get("colorHex")?.toString().trim() || "#7C3AED";
  const defaultPriceCOP = Math.round(Number(formData.get("defaultPriceCOP")));
  const defaultPeriod = (formData.get("defaultPeriod")?.toString() || "MENSUAL") as "MENSUAL" | "ANUAL";

  if (!shortDescription || !description || !defaultPriceCOP) {
    return { error: "Completa todos los campos requeridos." };
  }

  await prisma.serviceOffering.update({
    where: { id: serviceId },
    data: { shortDescription, description, colorHex, defaultPriceCOP, defaultPeriod },
  });

  revalidatePath("/servicios");
  revalidatePath("/landing");
  return { success: true };
}

export async function toggleServicePublished(serviceId: string) {
  await requireSession();
  const service = await prisma.serviceOffering.findUnique({ where: { id: serviceId } });
  if (!service) return;
  await prisma.serviceOffering.update({
    where: { id: serviceId },
    data: { isPublished: !service.isPublished },
  });
  revalidatePath("/servicios");
  revalidatePath("/landing");
}
