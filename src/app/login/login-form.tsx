"use client";

import { useActionState } from "react";
import { authenticate } from "@/lib/actions/login";

export default function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction, pending] = useActionState(authenticate, {});

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl || "/"} />

      <div>
        <label htmlFor="cedula" className="mb-1.5 block text-sm font-medium text-slate-200">
          Cedula
        </label>
        <input
          id="cedula"
          name="cedula"
          type="text"
          inputMode="numeric"
          autoComplete="username"
          required
          placeholder="Numero de cedula"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-white placeholder-slate-500 outline-none focus:border-brand focus:ring-2 focus:ring-brand/40"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-200">
          Contrasena
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="********"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3.5 py-2.5 text-white placeholder-slate-500 outline-none focus:border-brand focus:ring-2 focus:ring-brand/40"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition hover:bg-brand-dark disabled:opacity-60"
      >
        {pending ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
