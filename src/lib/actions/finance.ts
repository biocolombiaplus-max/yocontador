"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSession } from "@/lib/session";

export type FinanceFormState = { error?: string; success?: boolean };

function parseAmount(raw: FormDataEntryValue | null): number | null {
  const value = Math.round(Number(raw));
  if (!Number.isFinite(value) || value <= 0) return null;
  return value;
}

export async function createIncome(
  _prevState: FinanceFormState,
  formData: FormData
): Promise<FinanceFormState> {
  const session = await requireSession();

  const companyId = formData.get("companyId")?.toString();
  const companySlug = formData.get("companySlug")?.toString();
  const description = formData.get("description")?.toString().trim() ?? "";
  const client = formData.get("client")?.toString().trim() || null;
  const dateRaw = formData.get("date")?.toString();
  const amount = parseAmount(formData.get("amount"));

  if (!companyId || !companySlug) return { error: "Solicitud invalida." };
  if (!description) return { error: "Escribe una descripcion para el ingreso." };
  if (!amount) return { error: "Ingresa un monto valido, mayor a cero." };

  await prisma.income.create({
    data: {
      companyId,
      description,
      client,
      amount,
      date: dateRaw ? new Date(dateRaw) : new Date(),
      createdById: session.user.id,
    },
  });

  revalidatePath(`/empresas/${companySlug}/finanzas`);
  revalidatePath("/finanzas");
  revalidatePath("/");
  return { success: true };
}

export async function createExpense(
  _prevState: FinanceFormState,
  formData: FormData
): Promise<FinanceFormState> {
  const session = await requireSession();

  const companyId = formData.get("companyId")?.toString();
  const companySlug = formData.get("companySlug")?.toString();
  const description = formData.get("description")?.toString().trim() ?? "";
  const category = formData.get("category")?.toString() || "OTRO";
  const dateRaw = formData.get("date")?.toString();
  const amount = parseAmount(formData.get("amount"));

  if (!companyId || !companySlug) return { error: "Solicitud invalida." };
  if (!description) return { error: "Escribe una descripcion para el gasto." };
  if (!amount) return { error: "Ingresa un monto valido, mayor a cero." };

  await prisma.expense.create({
    data: {
      companyId,
      description,
      category: category as
        | "NOMINA"
        | "ARRIENDO"
        | "SERVICIOS"
        | "MARKETING"
        | "INSUMOS"
        | "TECNOLOGIA"
        | "IMPUESTOS"
        | "OTRO",
      amount,
      date: dateRaw ? new Date(dateRaw) : new Date(),
      createdById: session.user.id,
    },
  });

  revalidatePath(`/empresas/${companySlug}/finanzas`);
  revalidatePath("/finanzas");
  revalidatePath("/");
  return { success: true };
}

export async function deleteIncome(id: string, companySlug: string) {
  await requireSession();
  await prisma.income.delete({ where: { id } });
  revalidatePath(`/empresas/${companySlug}/finanzas`);
  revalidatePath("/finanzas");
  revalidatePath("/");
}

export async function deleteExpense(id: string, companySlug: string) {
  await requireSession();
  await prisma.expense.delete({ where: { id } });
  revalidatePath(`/empresas/${companySlug}/finanzas`);
  revalidatePath("/finanzas");
  revalidatePath("/");
}
