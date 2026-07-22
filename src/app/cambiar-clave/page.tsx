import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ChangePasswordForm from "@/components/change-password-form";

export default async function CambiarClavePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-white">Bienvenido, {session.user.name}</h1>
          <p className="mt-1 text-sm text-slate-400">
            Por seguridad, define tu contrasena personal antes de continuar.
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur">
          <ChangePasswordForm forced />
        </div>
      </div>
    </div>
  );
}
