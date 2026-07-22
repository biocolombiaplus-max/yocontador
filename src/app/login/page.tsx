import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import LoginForm from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/");
  }
  const { callbackUrl } = await searchParams;

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand text-xl font-bold text-white shadow-lg shadow-teal-900/40">
            BC
          </div>
          <h1 className="text-2xl font-semibold text-white">BIO COLOMBIA</h1>
          <p className="mt-1 text-sm text-slate-400">Panel administrativo de grupo</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur">
          <LoginForm callbackUrl={callbackUrl} />
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Acceso restringido. Solo usuarios autorizados de BIO COLOMBIA.
        </p>
      </div>
    </div>
  );
}
