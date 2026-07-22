"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type LoginState = { error?: string };

export async function authenticate(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  try {
    const cedula = formData.get("cedula")?.toString().trim();
    const user = cedula ? await prisma.user.findUnique({ where: { cedula } }) : null;
    const destination = user?.mustChangePassword
      ? "/cambiar-clave"
      : (formData.get("callbackUrl")?.toString() || "/");

    await signIn("credentials", {
      cedula: formData.get("cedula"),
      password: formData.get("password"),
      redirectTo: destination,
    });
    return {};
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Cedula o contrasena incorrecta." };
      }
      return { error: "No fue posible iniciar sesion." };
    }
    throw error;
  }
}
