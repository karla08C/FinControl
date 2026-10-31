import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useExpenses, useBudgets, useCategories, useIncomeCategories } from "@/lib/storage";
import { formatBRL, monthLabel, isSameMonth, parseCurrency, type Category } from "@/lib/finance";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/orcamento")({
  head: () => ({
    meta: [
      { title: "Orçamento — FinControl" },
      { name: "description", content: "Defina e acompanhe seu orçamento mensal por categoria." },
      { property: "og:title", content: "Orçamento — FinControl" },
      { property: "og:description", content: "Defina e acompanhe seu orçamento mensal por categoria." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrcamentoPage,
});

function OrcamentoPage() {
  const { expenses } = useExpenses();
  const { budgets, setBudgets } = useBudgets();
  const expCats = useCategories();
  const incCats = useIncomeCategories();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [newExpCat, setNewExpCat] = useState("");
  const [newIncCat, setNewIncCat] = useState("");

  type Row = { cat: string; spent: number; budget: number; pct: number };
  const rows: Row[] = useMemo(() => {
    return expCats.all.map((cat) => {
      const spent = expenses
        .filter((e) => e.category === cat && isSameMonth(e.date, year, month))
        .reduce((s, e) => s + e.amount, 0);
      const budget = budgets[cat] ?? 0;
      const pct = budget > 0 ? spent / budget : 0;
      return { cat, spent, budget, pct };
    });
  }, [expCats.all, expenses, year, month, budgets]);

  const totalSpent = useMemo(() => rows.reduce((s: number, r: Row) => s + r.spent, 0), [rows]);
  const totalBudget = useMemo(() => rows.reduce((s: number, r: Row) => s + r.budget, 0), [rows]);
  const totalPct = totalBudget > 0 ? totalSpent / totalBudget : 0;

  const updateBudget = (cat: Category, value: string) => {
    const v = parseCurrency(value);
    setBudgets({ ...budgets, [cat]: v });
  };

  const handleAddExpCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpCat.trim()) return;
    expCats.add(newExpCat.trim());
    toast.success(`Categoria "${newExpCat.trim()}" adicionada.`);
    setNewExpCat("");
  };

  const handleAddIncCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIncCat.trim()) return;
    incCats.add(newIncCat.trim());
    toast.success(`Categoria "${newIncCat.trim()}" adicionada.`);
    setNewIncCat("");
  };

  return (
    <AppShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Orçamento</h1>
            <p className="text-muted-foreground mt-1">Defina limites mensais e veja onde você está estourando.</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="h-10 rounded-md border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              aria-label="Selecionar mês"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {monthLabel(i)}
                </option>
              ))}
            </select>
            <select
              className="h-10 rounded-md border bg-card px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              aria-label="Selecionar ano"
            >
              {[year - 1, year, year + 1].map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </header>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
              <div>
                <div className="text-sm text-muted-foreground">
                  Total — {monthLabel(month)}/{year}
                </div>
                <div className="text-2xl font-semibold mt-1">
                  {formatBRL(totalSpent)} <span className="text-muted-foreground text-base">/ {formatBRL(totalBudget)}</span>
                </div>
              </div>
              <div
                className={cn(
                  "text-sm font-semibold",
                  totalPct >= 1 ? "text-destructive" : totalPct >= 0.8 ? "text-warning" : "text-success",
                )}
              >
                {(totalPct * 100).toFixed(0)}% usado
              </div>
            </div>
            <ProgressBar pct={totalPct} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Por categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-5">
              {rows.map((r: Row) => (
                <div key={r.cat} className="grid grid-cols-12 gap-3 items-center">
                  <div className="col-span-12 md:col-span-3 font-medium flex items-center gap-2">
                    {r.cat}
                    {expCats.isCustom(r.cat) && (
                      <button
                        onClick={() => {
                          expCats.remove(r.cat);
                          toast.success(`Categoria "${r.cat}" removida.`);
                        }}
                        className="text-muted-foreground hover:text-destructive p-0.5"
                        aria-label={`Remover categoria ${r.cat}`}
                        title="Remover categoria customizada"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="col-span-7 md:col-span-6">
                    <ProgressBar pct={r.pct} />
                    <div className="flex items-center justify-between mt-1 text-xs text-muted-foreground">
                      <span>{formatBRL(r.spent)} usado</span>
                      <span>{r.budget > 0 ? `${(r.pct * 100).toFixed(0)}%` : "—"}</span>
                    </div>
                  </div>
                  <div className="col-span-5 md:col-span-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">R$</span>
                      <Input
                        inputMode="decimal"
                        defaultValue={r.budget || ""}
                        key={`${r.cat}-${r.budget}`}
                        onBlur={(e) => updateBudget(r.cat, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            (e.target as HTMLInputElement).blur();
                          }
                        }}
                        className="h-9"
                        placeholder="0,00"
                        aria-label={`Limite de orçamento para ${r.cat}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar categorias</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="text-sm font-medium mb-2">Categorias de despesas</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {expCats.all.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs"
                  >
                    {c}
                    {expCats.isCustom(c) && (
                      <button
                        onClick={() => {
                          expCats.remove(c);
                          toast.success(`Categoria "${c}" removida.`);
                        }}
                        aria-label={`Remover ${c}`}
                      >
                        <Trash2 className="size-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              <form onSubmit={handleAddExpCat} className="flex gap-2">
                <Input
                  placeholder="Nova categoria de despesa"
                  value={newExpCat}
                  onChange={(e) => setNewExpCat(e.target.value)}
                  aria-label="Nome da nova categoria de despesa"
                />
                <Button type="submit" size="sm">
                  <Plus className="size-4 mr-1" />
                  Adicionar
                </Button>
              </form>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Categorias de receitas</div>
              <div className="flex flex-wrap gap-2 mb-3">
                {incCats.all.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1.5 rounded-full bg-accent text-accent-foreground px-3 py-1 text-xs"
                  >
                    {c}
                    {incCats.isCustom(c) && (
                      <button
                        onClick={() => {
                          incCats.remove(c);
                          toast.success(`Categoria "${c}" removida.`);
                        }}
                        aria-label={`Remover ${c}`}
                      >
                        <Trash2 className="size-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              <form onSubmit={handleAddIncCat} className="flex gap-2">
                <Input
                  placeholder="Nova categoria de receita"
                  value={newIncCat}
                  onChange={(e) => setNewIncCat(e.target.value)}
                  aria-label="Nome da nova categoria de receita"
                />
                <Button type="submit" size="sm">
                  <Plus className="size-4 mr-1" />
                  Adicionar
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  const capped = Math.min(pct, 1);
  const over = pct > 1;
  const color = pct >= 1 ? "bg-destructive" : pct >= 0.8 ? "bg-warning" : "bg-success";
  return (
    <div className="relative h-2 w-full rounded-full bg-muted overflow-hidden">
      <div className={cn("h-full transition-all duration-300", color)} style={{ width: `${capped * 100}%` }} />
      {over && <div className="absolute inset-y-0 right-0 w-1 bg-destructive-foreground/40" />}
    </div>
  );
}
