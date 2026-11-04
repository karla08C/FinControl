import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import type { Budgets, Expense, Income } from "./finance";
import { DEFAULT_BUDGETS, DEFAULT_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from "./finance";

function getLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const INITIAL_DEMO_EXPENSES: Expense[] = [
  { id: "e-1", date: "2026-11-01", description: "Supermercado Semanal", category: "Alimentação", payment: "Cartão de Crédito", amount: 450.00 },
  { id: "e-2", date: "2026-11-02", description: "Combustível", category: "Transporte", payment: "Pix", amount: 180.00 },
  { id: "e-3", date: "2026-11-03", description: "Internet Fibra", category: "Contas", payment: "Débito Automático", amount: 120.00 },
  { id: "e-4", date: "2026-11-03", description: "Aporte Tesouro Direto", category: "Investimentos", payment: "Pix", amount: 600.00 },
];

const INITIAL_DEMO_INCOMES: Income[] = [
  { id: "i-1", date: "2026-11-01", description: "Salário Mensal", category: "Salário", source: "Empresa", amount: 5500.00 },
  { id: "i-2", date: "2026-11-02", description: "Projeto Freelance", category: "Freelance", source: "Cliente", amount: 1200.00 },
];

export function useExpenses() {
  const { user, session } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["expenses", user?.id],
    queryFn: async (): Promise<Expense[]> => {
      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from("expenses")
            .select("id, date, description, category, payment, amount")
            .order("date", { ascending: false });
          if (!error && data) {
            const mapped = data.map((r) => ({
              id: r.id,
              date: r.date,
              description: r.description,
              category: r.category,
              payment: r.payment,
              amount: Number(r.amount),
            }));
            setLocal("fincontrol_expenses", mapped);
            return mapped;
          }
        } catch {
          // Fallback to local
        }
      }
      return getLocal<Expense[]>("fincontrol_expenses", INITIAL_DEMO_EXPENSES);
    },
    staleTime: 1000 * 30,
  });

  const addMutation = useMutation({
    mutationFn: async (e: Omit<Expense, "id">) => {
      const newExpense: Expense = {
        ...e,
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `exp-${Date.now()}`,
      };

      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from("expenses")
            .insert({ ...e, user_id: session.user.id })
            .select()
            .single();
          if (!error && data) {
            newExpense.id = data.id;
          }
        } catch {}
      }

      const current = getLocal<Expense[]>("fincontrol_expenses", INITIAL_DEMO_EXPENSES);
      const updated = [newExpense, ...current];
      setLocal("fincontrol_expenses", updated);
      return newExpense;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", user?.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (session?.user) {
        try {
          await supabase.from("expenses").delete().eq("id", id);
        } catch {}
      }
      const current = getLocal<Expense[]>("fincontrol_expenses", INITIAL_DEMO_EXPENSES);
      const updated = current.filter((item) => item.id !== id);
      setLocal("fincontrol_expenses", updated);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", user?.id] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      if (session?.user) {
        try {
          await supabase.from("expenses").delete().eq("user_id", session.user.id);
        } catch {}
      }
      setLocal("fincontrol_expenses", []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", user?.id] });
    },
  });

  return {
    expenses: query.data ?? INITIAL_DEMO_EXPENSES,
    add: addMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    clear: clearMutation.mutateAsync,
    hydrated: !query.isLoading,
  };
}

export function useIncomes() {
  const { user, session } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["incomes", user?.id],
    queryFn: async (): Promise<Income[]> => {
      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from("incomes")
            .select("id, date, description, category, source, amount")
            .order("date", { ascending: false });
          if (!error && data) {
            const mapped = data.map((r) => ({
              id: r.id,
              date: r.date,
              description: r.description,
              category: r.category,
              source: r.source ?? "",
              amount: Number(r.amount),
            }));
            setLocal("fincontrol_incomes", mapped);
            return mapped;
          }
        } catch {
          // Fallback to local
        }
      }
      return getLocal<Income[]>("fincontrol_incomes", INITIAL_DEMO_INCOMES);
    },
    staleTime: 1000 * 30,
  });

  const addMutation = useMutation({
    mutationFn: async (i: Omit<Income, "id">) => {
      const newIncome: Income = {
        ...i,
        id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `inc-${Date.now()}`,
      };

      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from("incomes")
            .insert({ ...i, user_id: session.user.id })
            .select()
            .single();
          if (!error && data) {
            newIncome.id = data.id;
          }
        } catch {}
      }

      const current = getLocal<Income[]>("fincontrol_incomes", INITIAL_DEMO_INCOMES);
      const updated = [newIncome, ...current];
      setLocal("fincontrol_incomes", updated);
      return newIncome;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes", user?.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      if (session?.user) {
        try {
          await supabase.from("incomes").delete().eq("id", id);
        } catch {}
      }
      const current = getLocal<Income[]>("fincontrol_incomes", INITIAL_DEMO_INCOMES);
      const updated = current.filter((item) => item.id !== id);
      setLocal("fincontrol_incomes", updated);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes", user?.id] });
    },
  });

  return {
    incomes: query.data ?? INITIAL_DEMO_INCOMES,
    add: addMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    hydrated: !query.isLoading,
  };
}

export function useBudgets() {
  const { user, session } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["budgets", user?.id],
    queryFn: async (): Promise<Budgets> => {
      if (session?.user) {
        try {
          const { data, error } = await supabase.from("budgets").select("*");
          if (!error && data) {
            const map: Budgets = { ...DEFAULT_BUDGETS };
            data.forEach((r) => {
              map[r.category] = Number(r.amount);
            });
            setLocal("fincontrol_budgets", map);
            return map;
          }
        } catch {}
      }
      return getLocal<Budgets>("fincontrol_budgets", DEFAULT_BUDGETS);
    },
    staleTime: 1000 * 30,
  });

  const updateMutation = useMutation({
    mutationFn: async (next: Budgets) => {
      setLocal("fincontrol_budgets", next);
      if (session?.user) {
        try {
          const rows = Object.entries(next).map(([category, amount]) => ({
            user_id: session.user.id,
            category,
            amount,
          }));
          if (rows.length > 0) {
            await supabase.from("budgets").upsert(rows, { onConflict: "user_id,category" });
          }
        } catch {}
      }
      return next;
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.setQueryData(["budgets", user?.id], data);
      }
      queryClient.invalidateQueries({ queryKey: ["budgets", user?.id] });
    },
  });

  const setBudgets = (updater: Budgets | ((prev: Budgets) => Budgets)) => {
    const current = query.data ?? DEFAULT_BUDGETS;
    const next = typeof updater === "function" ? updater(current) : updater;
    queryClient.setQueryData(["budgets", user?.id], next);
    updateMutation.mutate(next);
  };

  return {
    budgets: query.data ?? DEFAULT_BUDGETS,
    setBudgets,
    hydrated: !query.isLoading,
  };
}

function useCustomCategoriesOfKind(kind: "expense" | "income", defaults: string[]) {
  const { user, session } = useAuth();
  const queryClient = useQueryClient();
  const storageKey = `fincontrol_categories_${kind}`;

  const query = useQuery({
    queryKey: ["custom_categories", kind, user?.id],
    queryFn: async (): Promise<string[]> => {
      if (session?.user) {
        try {
          const { data, error } = await supabase
            .from("custom_categories")
            .select("name")
            .eq("kind", kind);
          if (!error && data) {
            const names = data.map((r) => r.name);
            setLocal(storageKey, names);
            return names;
          }
        } catch {}
      }
      return getLocal<string[]>(storageKey, []);
    },
    staleTime: 1000 * 30,
  });

  const custom = query.data ?? [];
  const all = Array.from(new Set([...defaults, ...custom]));

  const addMutation = useMutation({
    mutationFn: async (name: string) => {
      const n = name.trim();
      if (!n || all.includes(n)) return;
      const updated = [...custom, n];
      setLocal(storageKey, updated);
      if (session?.user) {
        try {
          await supabase.from("custom_categories").insert({ user_id: session.user.id, kind, name: n });
        } catch {}
      }
      return n;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom_categories", kind, user?.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (name: string) => {
      const updated = custom.filter((item) => item !== name);
      setLocal(storageKey, updated);
      if (session?.user) {
        try {
          await supabase
            .from("custom_categories")
            .delete()
            .eq("user_id", session.user.id)
            .eq("kind", kind)
            .eq("name", name);
        } catch {}
      }
      return name;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom_categories", kind, user?.id] });
    },
  });

  const isCustom = (name: string) => custom.includes(name);

  return {
    all,
    custom,
    add: addMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    isCustom,
  };
}

export function useCategories() {
  return useCustomCategoriesOfKind("expense", DEFAULT_CATEGORIES);
}

export function useIncomeCategories() {
  return useCustomCategoriesOfKind("income", DEFAULT_INCOME_CATEGORIES);
}
