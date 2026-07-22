"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, Building2, Settings } from "lucide-react";
import clsx from "clsx";

type Company = { id: string; name: string; slug: string; colorHex: string };

export default function MobileNav({ companies }: { companies: Company[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menu"
        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100"
      >
        <Menu size={19} />
      </button>

      {open && (
        <div className="fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative flex h-full w-72 flex-col bg-slate-950 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 px-4 py-4">
              <span className="text-sm font-semibold text-white">BIO COLOMBIA</span>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className={clsx(
                  "mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium",
                  pathname === "/" ? "bg-brand/15 text-brand" : "text-slate-300"
                )}
              >
                <LayoutDashboard size={17} />
                Resumen general
              </Link>
              <Link
                href="/empresas"
                onClick={() => setOpen(false)}
                className={clsx(
                  "mb-3 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium",
                  pathname === "/empresas" ? "bg-brand/15 text-brand" : "text-slate-300"
                )}
              >
                <Building2 size={17} />
                Todas las empresas
              </Link>
              <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                Empresas
              </p>
              <div className="mb-3 space-y-0.5">
                {companies.map((c) => (
                  <Link
                    key={c.id}
                    href={`/empresas/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className={clsx(
                      "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium",
                      pathname.startsWith(`/empresas/${c.slug}`)
                        ? "bg-slate-900 text-white"
                        : "text-slate-400"
                    )}
                  >
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: c.colorHex }}
                    />
                    <span className="truncate">{c.name}</span>
                  </Link>
                ))}
              </div>
              <Link
                href="/ajustes"
                onClick={() => setOpen(false)}
                className={clsx(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium",
                  pathname === "/ajustes" ? "bg-brand/15 text-brand" : "text-slate-300"
                )}
              >
                <Settings size={17} />
                Ajustes de cuenta
              </Link>
            </nav>
          </div>
        </div>
      )}
    </div>
  );
}
