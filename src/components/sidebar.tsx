"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, Settings, ChevronRight } from "lucide-react";
import clsx from "clsx";

type Company = { id: string; name: string; slug: string; colorHex: string };

export default function Sidebar({ companies }: { companies: Company[] }) {
  const pathname = usePathname();

  const isDashboard = pathname === "/";
  const isEmpresasRoot = pathname === "/empresas";
  const isAjustes = pathname === "/ajustes";

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-slate-800 bg-slate-950 lg:flex">
      <div className="flex items-center gap-2.5 border-b border-slate-800 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-sm font-bold text-white">
          BC
        </div>
        <div>
          <p className="text-sm font-semibold text-white">BIO COLOMBIA</p>
          <p className="text-xs text-slate-500">Panel de grupo</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <Link
          href="/"
          className={clsx(
            "mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition",
            isDashboard ? "bg-brand/15 text-brand" : "text-slate-300 hover:bg-slate-900 hover:text-white"
          )}
        >
          <LayoutDashboard size={17} />
          Resumen general
        </Link>

        <Link
          href="/empresas"
          className={clsx(
            "mb-3 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition",
            isEmpresasRoot ? "bg-brand/15 text-brand" : "text-slate-300 hover:bg-slate-900 hover:text-white"
          )}
        >
          <Building2 size={17} />
          Todas las empresas
        </Link>

        <p className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
          Empresas
        </p>
        <div className="mb-3 space-y-0.5">
          {companies.map((c) => {
            const active = pathname.startsWith(`/empresas/${c.slug}`);
            return (
              <Link
                key={c.id}
                href={`/empresas/${c.slug}`}
                className={clsx(
                  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-900 hover:text-white"
                )}
              >
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: c.colorHex }}
                />
                <span className="truncate">{c.name}</span>
                {active && <ChevronRight size={14} className="ml-auto shrink-0" />}
              </Link>
            );
          })}
          {companies.length === 0 && (
            <p className="px-3 text-xs text-slate-600">Aun no hay empresas activas.</p>
          )}
        </div>

        <Link
          href="/ajustes"
          className={clsx(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition",
            isAjustes ? "bg-brand/15 text-brand" : "text-slate-300 hover:bg-slate-900 hover:text-white"
          )}
        >
          <Settings size={17} />
          Ajustes de cuenta
        </Link>
      </nav>

      <div className="border-t border-slate-800 px-4 py-3">
        <p className="text-xs text-slate-600">Grupo empresarial BIO COLOMBIA</p>
      </div>
    </aside>
  );
}
