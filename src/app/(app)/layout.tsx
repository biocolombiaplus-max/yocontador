import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Sidebar from "@/components/sidebar";
import Topbar from "@/components/topbar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  // mustChangePassword enforcement lives in proxy.ts, which checks the
  // database directly to avoid acting on a stale JWT right after a change.

  const companies = await prisma.company.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    select: { id: true, name: true, slug: true, colorHex: true },
  });

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar companies={companies} />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-64">
        <Topbar user={session.user} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
