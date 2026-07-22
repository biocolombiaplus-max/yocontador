"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export type SocialAccountFormState = { error?: string; success?: boolean };

export async function updateSocialAccount(
  _prevState: SocialAccountFormState,
  formData: FormData
): Promise<SocialAccountFormState> {
  await requireSession();

  const id = formData.get("id")?.toString();
  const companySlug = formData.get("companySlug")?.toString();
  if (!id || !companySlug) return { error: "Solicitud invalida." };

  const handle = formData.get("handle")?.toString().trim() ?? "";
  const displayName = formData.get("displayName")?.toString().trim() || null;
  const profileUrl = formData.get("profileUrl")?.toString().trim() || null;
  const status = formData.get("status")?.toString() ?? "PENDIENTE";
  const followers = Number(formData.get("followers")) || 0;
  const accessToken = formData.get("accessToken")?.toString().trim() || null;
  const notes = formData.get("notes")?.toString().trim() || null;

  if (!handle) {
    return { error: "El usuario / handle es obligatorio." };
  }

  await prisma.socialAccount.update({
    where: { id },
    data: {
      handle,
      displayName,
      profileUrl,
      status: status as "CONECTADA" | "PENDIENTE" | "DESCONECTADA",
      followers,
      accessToken,
      notes,
      connectedAt: status === "CONECTADA" ? new Date() : null,
    },
  });

  revalidatePath(`/empresas/${companySlug}/redes`);
  return { success: true };
}
