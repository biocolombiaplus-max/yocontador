import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PageHeader, Card } from "@/components/ui";
import ChangePasswordForm from "@/components/change-password-form";
import { ROLE_META } from "@/lib/constants";

export default async function AjustesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const roleLabel = ROLE_META[session.user.role as keyof typeof ROLE_META]?.label ?? session.user.role;

  return (
    <div className="max-w-lg">
      <PageHeader title="Ajustes de cuenta" description="Datos de acceso y seguridad de tu cuenta." />

      <Card className="mb-5 p-4">
        <p className="text-sm text-slate-500">Nombre</p>
        <p className="mb-3 text-sm font-medium text-slate-900">{session.user.name}</p>
        <p className="text-sm text-slate-500">Cedula</p>
        <p className="mb-3 text-sm font-medium text-slate-900">{session.user.cedula}</p>
        <p className="text-sm text-slate-500">Rol</p>
        <p className="text-sm font-medium text-slate-900">{roleLabel}</p>
      </Card>

      <Card className="border-slate-800 bg-slate-950 p-5">
        <h2 className="mb-4 text-sm font-semibold text-white">Cambiar contrasena</h2>
        <ChangePasswordForm />
      </Card>
    </div>
  );
}
