import Link from "next/link";
import { TrendingUp, TrendingDown, Wallet, CalendarDays, ArrowUpRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, PageHeader } from "@/components/ui";
import { StatTile } from "@/components/stat-tile";
import { formatCOP } from "@/lib/money";
import { PROFIT_PARTNERS } from "@/lib/constants";
import IncomeExpenseChart, {
  type IncomeExpensePoint,
} from "@/components/charts/income-expense-chart";

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

export default async function GroupFinancePage() {
  const now = new Date();
  const today = startOfDay(now);
  const monthStart = startOfMonth(now);
  const rangeStart = monthsAgo(now, 5);

  const [incomesAll, expensesAll, incomesRange, expensesRange, companies] = await Promise.all([
    prisma.income.aggregate({ _sum: { amount: true } }),
    prisma.expense.aggregate({ _sum: { amount: true } }),
    prisma.income.findMany({ where: { date: { gte: rangeStart } } }),
    prisma.expense.findMany({ where: { date: { gte: rangeStart } } }),
    prisma.company.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
      select: { id: true, name: true, slug: true, colorHex: true },
    }),
  ]);

  const totalIncomeAllTime = incomesAll._sum.amount ?? 0;
  const totalExpenseAllTime = expensesAll._sum.amount ?? 0;
  const netProfitAllTime = totalIncomeAllTime - totalExpenseAllTime;

  const incomeToday = incomesRange
    .filter((i) => i.date >= today)
    .reduce((s, i) => s + i.amount, 0);
  const incomeMonth = incomesRange
    .filter((i) => i.date >= monthStart)
    .reduce((s, i) => s + i.amount, 0);
  const expenseMonth = expensesRange
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
  for (const inc of incomesRange) {
    const key = `${inc.date.getFullYear()}-${inc.date.getMonth()}`;
    const point = monthly.get(key);
    if (point) point.ingresos += inc.amount;
  }
  for (const exp of expensesRange) {
    const key = `${exp.date.getFullYear()}-${exp.date.getMonth()}`;
    const point = monthly.get(key);
    if (point) point.gastos += exp.amount;
  }

  const perCompany = await Promise.all(
    companies.map(async (c) => {
      const [inc, exp] = await Promise.all([
        prisma.income.aggregate({ where: { companyId: c.id, date: { gte: monthStart } }, _sum: { amount: true } }),
        prisma.expense.aggregate({ where: { companyId: c.id, date: { gte: monthStart } }, _sum: { amount: true } }),
      ]);
      const income = inc._sum.amount ?? 0;
      const expense = exp._sum.amount ?? 0;
      return { ...c, income, expense, profit: income - expense };
    })
  );

  return (
    <div>
      <PageHeader
        title="Finanzas"
        description="Facturacion y gastos consolidados de todas las empresas de BIO COLOMBIA."
      />

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Facturado hoy" value={formatCOP(incomeToday)} icon={CalendarDays} />
        <StatTile label="Facturado este mes" value={formatCOP(incomeMonth)} icon={TrendingUp} />
        <StatTile label="Gastado este mes" value={formatCOP(expenseMonth)} icon={TrendingDown} />
        <StatTile label="Utilidad del mes" value={formatCOP(profitMonth)} icon={Wallet} />
      </div>

      <Card className="mb-5 border-brand/20 bg-brand/5 p-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-900">
            Reparto de utilidades (50% / 50%, despues de gastos totales)
          </h2>
          <p className="text-xs text-slate-500">
            Utilidad neta historica: <span className="font-medium">{formatCOP(netProfitAllTime)}</span>
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {PROFIT_PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div className="mb-2 flex items-center gap-2.5">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: partner.color }}
                >
                  {partner.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{partner.name}</p>
                  <p className="text-xs text-slate-500">{partner.share * 100}% de la utilidad</p>
                </div>
              </div>
              <p className="text-2xl font-semibold tabular-nums text-slate-900">
                {formatCOP(Math.round(profitMonth * partner.share))}
              </p>
              <p className="text-xs text-slate-500">este mes</p>
              <p className="mt-2 text-sm font-medium tabular-nums text-slate-600">
                {formatCOP(Math.round(netProfitAllTime * partner.share))}{" "}
                <span className="font-normal text-slate-400">historico</span>
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-5 p-4">
        <h2 className="mb-2 text-sm font-semibold text-slate-900">
          Ingresos vs. gastos del grupo (ultimos 6 meses)
        </h2>
        <IncomeExpenseChart data={Array.from(monthly.values())} />
      </Card>

      <h2 className="mb-3 text-sm font-semibold text-slate-900">Por empresa (este mes)</h2>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-2.5 font-medium">Empresa</th>
              <th className="px-4 py-2.5 text-right font-medium">Facturado</th>
              <th className="px-4 py-2.5 text-right font-medium">Gastado</th>
              <th className="px-4 py-2.5 text-right font-medium">Utilidad</th>
              <th className="w-10 px-4 py-2.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {perCompany.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60">
                <td className="px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: c.colorHex }}
                    />
                    <span className="font-medium text-slate-800">{c.name}</span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-emerald-700">
                  {formatCOP(c.income)}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-right tabular-nums text-red-600">
                  {formatCOP(c.expense)}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5 text-right font-medium tabular-nums text-slate-900">
                  {formatCOP(c.profit)}
                </td>
                <td className="px-4 py-2.5 text-right">
                  <Link
                    href={`/empresas/${c.slug}/finanzas`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-brand"
                  >
                    Ver <ArrowUpRight size={12} />
                  </Link>
                </td>
              </tr>
            ))}
            {perCompany.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-sm text-slate-500">
                  No hay empresas activas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
