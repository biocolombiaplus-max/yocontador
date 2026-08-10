"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export type ClientFormState = { error?: string; success?: boolean; clientId?: string };

export async function createClient(
  _prevState: ClientFormState,
  formData: FormData
): Promise<ClientFormState> {
  await requireSession();

  const firstName = formData.get("firstName")?.toString().trim() ?? "";
  const lastName = formData.get("lastName")?.toString().trim() ?? "";
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const phone = formData.get("phone")?.toString().trim() ?? "";
  const companyName = formData.get("companyName")?.toString().trim() || null;
  const notes = formData.get("notes")?.toString().trim() || null;

  if (!firstName || !lastName || !email || !phone) {
    return { error: "Nombre, apellido, correo y telefono son obligatorios." };
  }

  const existing = await prisma.client.findUnique({ where: { email } });
  if (existing) {
    return { error: "Ya existe un cliente registrado con ese correo." };
  }

  const client = await prisma.client.create({
    data: { firstName, lastName, email, phone, companyName, notes },
  });

  revalidatePath("/clientes");
  return { success: true, clientId: client.id };
}

export async function updateClientNotes(clientId: string, notes: string) {
  await requireSession();
  await prisma.client.update({ where: { id: clientId }, data: { notes } });
  revalidatePath(`/clientes/${clientId}`);
}
