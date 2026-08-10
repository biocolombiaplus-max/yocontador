"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function CompanyTabs({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/empresas/${slug}`;

  const tabs = [
    { href: base, label: "Resumen", exact: true },
    { href: `${base}/redes`, label: "Redes sociales" },
    { href: `${base}/contenido`, label: "Contenido" },
    { href: `${base}/estadisticas`, label: "Estadisticas" },
    { href: `${base}/finanzas`, label: "Finanzas" },
  ];

  return (
    <div className="flex gap-1 overflow-x-auto border-b border-slate-200">
      {tabs.map((tab) => {
        const active = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={clsx(
              "whitespace-nowrap border-b-2 px-3.5 py-2.5 text-sm font-medium transition",
              active
                ? "border-brand text-brand"
                : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
