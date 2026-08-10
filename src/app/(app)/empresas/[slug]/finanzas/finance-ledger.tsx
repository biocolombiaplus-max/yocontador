"use client";

import { useTransition } from "react";
import { Trash2, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { deleteIncome, deleteExpense } from "@/lib/actions/finance";
import { formatCOP } from "@/lib/money";
import { EXPENSE_CATEGORY_META } from "@/lib/constants";

type LedgerEntry = {
  id: string;
  kind: "INGRESO" | "GASTO";
  date: Date;
  amount: number;
  description: string;
  meta?: string;
  createdByName: string | null;
};

export default function FinanceLedger({
  entries,
  companySlug,
}: {
  entries: LedgerEntry[];
  companySlug: string;
}) {
  const [isPending, startTransition] = useTransition();

  if (entries.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
        Aun no hay movimientos registrados.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th className="px-4 py-2.5 font-medium">Fecha</th>
            <th className="px-4 py-2.5 font-medium">Descripcion</th>
            <th className="px-4 py-2.5 font-medium">Registrado por</th>
            <th className="px-4 py-2.5 text-right font-medium">Monto</th>
            <th className="w-10 px-2 py-2.5" />
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {entries.map((entry) => (
            <tr key={`${entry.kind}-${entry.id}`} className="hover:bg-slate-50/60">
              <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">
                {new Date(entry.date).toLocaleDateString("es-CO")}
              </td>
              <td className="px-4 py-2.5">
                <div className="flex items-center gap-2">
                  {entry.kind === "INGRESO" ? (
                    <ArrowUpCircle size={15} className="shrink-0 text-emerald-600" />
                  ) : (
                    <ArrowDownCircle size={15} className="shrink-0 text-red-500" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">{entry.description}</p>
                    {entry.meta && (
                      <p className="text-xs text-slate-500">
                        {entry.kind === "GASTO"
                          ? EXPENSE_CATEGORY_META[entry.meta as keyof typeof EXPENSE_CATEGORY_META]
                              ?.label ?? entry.meta
                          : entry.meta}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="whitespace-nowrap px-4 py-2.5 text-slate-500">
                {entry.createdByName ?? "Sistema"}
              </td>
              <td
                className={
                  "whitespace-nowrap px-4 py-2.5 text-right font-medium tabular-nums " +
                  (entry.kind === "INGRESO" ? "text-emerald-700" : "text-red-600")
                }
              >
                {entry.kind === "GASTO" ? "-" : "+"}
                {formatCOP(entry.amount)}
              </td>
              <td className="px-2 py-2.5 text-right">
                <button
                  disabled={isPending}
                  onClick={() =>
                    startTransition(() =>
                      entry.kind === "INGRESO"
                        ? deleteIncome(entry.id, companySlug)
                        : deleteExpense(entry.id, companySlug)
                    )
                  }
                  className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500"
                  aria-label="Eliminar"
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
