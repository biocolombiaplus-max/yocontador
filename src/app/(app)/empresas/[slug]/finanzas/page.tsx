import { notFound } from "next/navigation";
import { TrendingUp, TrendingDown, Wallet, CalendarDays } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader } from "@/components/ui";
import { StatTile } from "@/components/stat-tile";
import { formatCOP } from "@/lib/money";
import IncomeExpenseChart, {
  type IncomeExpensePoint,
} from "@/components/charts/income-expense-chart";
import NewIncomeForm from "./new-income-form";
import NewExpenseForm from "./new-expense-form";
import FinanceLedger from "./finance-ledger";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function monthsAgo(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() - n, 1);
}

export default async function CompanyFinancePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await prisma.company.findUnique({ where: { slug } });
  if (!company) notFound();

  const now = new Date();
  const today = startOfDay(now);
  const monthStart = startOfMonth(now);
  const rangeStart = monthsAgo(now, 5);

  const [incomes, expenses] = await Promise.all([
    prisma.income.findMany({
      where: { companyId: company.id, date: { gte: rangeStart } },
      orderBy: { date: "desc" },
      include: { createdBy: { select: { name: true } } },
    }),
    prisma.expense.findMany({
      where: { companyId: company.id, date: { gte: rangeStart } },
      orderBy: { date: "desc" },
      include: { createdBy: { select: { name: true } } },
    }),
  ]);

  const incomeToday = incomes
    .filter((i) => i.date >= today)
    .reduce((s, i) => s + i.amount, 0);
  const incomeMonth = incomes
    .filter((i) => i.date >= monthStart)
    .reduce((s, i) => s + i.amount, 0);
  const expenseMonth = expenses
    .filter((e) => e.date >= monthStart)
    .reduce((s, e) => s + e.amount, 0);
  const profitMonth = incomeMonth - expenseMonth;

  const monthly = new Map<string, IncomeExpensePoint>();
  for (let i = 5; i >= 0; i--) {
    const d = monthsAgo(now, i);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    monthly.set(key, {
      label: d.toLocaleDateString("es-CO", { month: "short", year: "2-digit" }),
      ingresos: 0,
      gastos: 0,
    });
  }
  for (const inc of incomes) {
    const key = `${inc.date.getFullYear()}-${inc.date.getMonth()}`;
    const point = monthly.get(key);
    if (point) point.ingresos += inc.amount;
  }
  for (const exp of expenses) {
    const key = `${exp.date.getFullYear()}-${exp.date.getMonth()}`;
    const point = monthly.get(key);
    if (point) point.gastos += exp.amount;
  }

  const ledger = [
    ...incomes.map((i) => ({
      id: i.id,
      kind: "INGRESO" as const,
      date: i.date,
      amount: i.amount,
      description: i.description,
      meta: i.client ?? undefined,
      createdByName: i.createdBy?.name ?? null,
    })),
    ...expenses.map((e) => ({
      id: e.id,
      kind: "GASTO" as const,
      date: e.date,
      amount: e.amount,
      description: e.description,
      meta: e.category as string,
      createdByName: e.createdBy?.name ?? null,
    })),
  ]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 40);

  return (
    <div>
      <PageHeader
        title="Finanzas"
        description="Facturacion, gastos y utilidad de la empresa."
        action={
          <div className="flex gap-2">
            <NewExpenseForm companyId={company.id} companySlug={slug} />
            <NewIncomeForm companyId={company.id} companySlug={slug} />
          </div>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Facturado hoy" value={formatCOP(incomeToday)} icon={CalendarDays} />
        <StatTile label="Facturado este mes" value={formatCOP(incomeMonth)} icon={TrendingUp} />
        <StatTile label="Gastado este mes" value={formatCOP(expenseMonth)} icon={TrendingDown} />
        <StatTile label="Utilidad del mes" value={formatCOP(profitMonth)} icon={Wallet} />
      </div>

      <Card className="mb-5 p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-900">
          Ingresos vs. gastos (ultimos 6 meses)
        </h2>
        <IncomeExpenseChart data={Array.from(monthly.values())} />
      </Card>

      <h2 className="mb-3 text-sm font-semibold text-slate-900">Movimientos recientes</h2>
      <FinanceLedger entries={ledger} companySlug={slug} />
    </div>
  );
}
