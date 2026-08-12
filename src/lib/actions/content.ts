"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";
import { saveImage } from "@/lib/upload";

export type ContentFormState = { error?: string; success?: boolean };

const MAX_FILE_BYTES = 60 * 1024 * 1024; // 60MB

export async function createContentPost(
  _prevState: ContentFormState,
  formData: FormData
): Promise<ContentFormState> {
  const session = await requireSession();

  const companyId = formData.get("companyId")?.toString();
  const companySlug = formData.get("companySlug")?.toString();
  const title = formData.get("title")?.toString().trim() ?? "";
  const caption = formData.get("caption")?.toString().trim() ?? "";
  const mediaType = formData.get("mediaType")?.toString() ?? "IMAGEN";
  const status = formData.get("status")?.toString() ?? "BORRADOR";
  const scheduledAtRaw = formData.get("scheduledAt")?.toString();
  const targetIds = formData.getAll("targets").map((v) => v.toString());
  const file = formData.get("media") as File | null;

  if (!companyId || !companySlug || !title || !caption) {
    return { error: "Titulo, texto y empresa son obligatorios." };
  }

  let mediaUrl: string | null = null;

  if (file && file.size > 0) {
    if (file.size > MAX_FILE_BYTES) {
      return { error: "El archivo supera el limite de 60MB." };
    }
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
      "video/mp4",
      "video/quicktime",
      "video/webm",
    ];
    if (!allowed.includes(file.type)) {
      return { error: "Formato de archivo no soportado." };
    }

    mediaUrl = await saveImage(
      file,
      "contenido",
      companySlug,
      file.type.startsWith("video") ? ".mp4" : ".jpg"
    );
  }

  const post = await prisma.contentPost.create({
    data: {
      companyId,
      title,
      caption,
      mediaType: mediaType as "IMAGEN" | "VIDEO" | "REEL" | "CARRUSEL",
      mediaUrl,
      status: status as "BORRADOR" | "PROGRAMADO" | "PUBLICADO" | "FALLIDO",
      scheduledAt: scheduledAtRaw ? new Date(scheduledAtRaw) : null,
      publishedAt: status === "PUBLICADO" ? new Date() : null,
      createdById: session.user.id,
      targets: {
        create: targetIds.map((socialAccountId) => ({ socialAccountId })),
      },
    },
  });

  await prisma.activityLog.create({
    data: {
      companyId,
      userId: session.user.id,
      action: "CONTENIDO_CREADO",
      detail: `${title} (${mediaType})`,
    },
  });

  revalidatePath(`/empresas/${companySlug}/contenido`);
  void post;
  return { success: true };
}

export async function updateContentStatus(
  postId: string,
  companySlug: string,
  status: "BORRADOR" | "PROGRAMADO" | "PUBLICADO" | "FALLIDO"
) {
  await requireSession();
  await prisma.contentPost.update({
    where: { id: postId },
    data: {
      status,
      publishedAt: status === "PUBLICADO" ? new Date() : undefined,
    },
  });
  revalidatePath(`/empresas/${companySlug}/contenido`);
}

export async function deleteContentPost(postId: string, companySlug: string) {
  await requireSession();
  await prisma.contentPost.delete({ where: { id: postId } });
  revalidatePath(`/empresas/${companySlug}/contenido`);
}
