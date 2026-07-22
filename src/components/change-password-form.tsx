"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { changePassword } from "@/lib/actions/auth-actions";

export default function ChangePasswordForm({ forced = false }: { forced?: boolean }) {
  const [state, formAction, pending] = useActionState(changePassword, {});
  const router = useRouter();

  useEffect(() => {
    if (state?.success && forced) {
      router.push("/");
      router.refresh();
    }
  }, [state?.success, forced, router]);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-200">
          Contrasena actual
        </label>
        <input
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/40"
        />
        {forced && (
          <p className="mt-1 text-xs text-slate-500">
            Usa tu numero de cedula (asignado inicialmente por el sistema).
          </p>
        )}
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-200">
          Nueva contrasena
        </label>
        <input
          name="newPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/40"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-slate-200">
          Confirmar nueva contrasena
        </label>
        <input
          name="confirmPassword"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-white outline-none focus:border-brand focus:ring-2 focus:ring-brand/40"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{state.error}</p>
      )}
      {state?.success && !forced && (
        <p className="rounded-lg bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
          Contrasena actualizada correctamente.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Guardando..." : "Guardar contrasena"}
      </button>
    </form>
  );
}
