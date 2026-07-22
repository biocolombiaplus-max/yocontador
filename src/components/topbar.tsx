import { LogOut } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { logout } from "@/lib/actions/auth-actions";
import { ROLE_META } from "@/lib/constants";
import MobileNav from "@/components/mobile-nav";

type SessionUser = {
  name?: string | null;
  cedula: string;
  role: string;
  avatarColor: string;
};

export default async function Topbar({ user }: { user: SessionUser }) {
  const companies = await prisma.company.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true, colorHex: true },
  });

  const initials = (user.name ?? "")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const roleLabel = ROLE_META[user.role as keyof typeof ROLE_META]?.label ?? user.role;

  return (
    <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-3.5 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <MobileNav companies={companies} />
        <div>
          <p className="text-sm font-semibold text-slate-900">Hola, {user.name}</p>
          <p className="text-xs text-slate-500">{roleLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: user.avatarColor }}
        >
          {initials || "?"}
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            <LogOut size={15} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </form>
      </div>
    </header>
  );
}
