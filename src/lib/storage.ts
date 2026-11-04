import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./auth";
import type { Budgets, Expense, Income } from "./finance";
import { DEFAULT_BUDGETS, DEFAULT_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from "./finance";

export function useExpenses() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["expenses", user?.id],
    queryFn: async (): Promise<Expense[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("expenses")
        .select("id, date, description, category, payment, amount")
        .order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => ({
        id: r.id,
        date: r.date,
        description: r.description,
        category: r.category,
        payment: r.payment,
        amount: Number(r.amount),
      }));
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (e: Omit<Expense, "id">) => {
      if (!user) return;
      const { data, error } = await supabase
        .from("expenses")
        .insert({ ...e, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", user?.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", user?.id] });
    },
  });

  const clearMutation = useMutation({
    mutationFn: async () => {
      if (!user) return;
      const { error } = await supabase.from("expenses").delete().eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses", user?.id] });
    },
  });

  return {
    expenses: query.data ?? [],
    add: addMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    clear: clearMutation.mutateAsync,
    hydrated: !query.isLoading && (query.isSuccess || !user),
  };
}

export function useIncomes() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["incomes", user?.id],
    queryFn: async (): Promise<Income[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("incomes")
        .select("id, date, description, category, source, amount")
        .order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((r) => ({
        id: r.id,
        date: r.date,
        description: r.description,
        category: r.category,
        source: r.source ?? "",
        amount: Number(r.amount),
      }));
    },
    enabled: !!user,
  });

  const addMutation = useMutation({
    mutationFn: async (i: Omit<Income, "id">) => {
      if (!user) return;
      const { data, error } = await supabase
        .from("incomes")
        .insert({ ...i, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes", user?.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("incomes").delete().eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incomes", user?.id] });
    },
  });

  return {
    incomes: query.data ?? [],
    add: addMutation.mutateAsync,
    remove: removeMutation.mutateAsync,
    hydrated: !query.isLoading && (query.isSuccess || !user),
  };
}

export function useBudgets() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["budgets", user?.id],
    queryFn: async (): Promise<Budgets> => {
      if (!user) return DEFAULT_BUDGETS;
      const { data, error } = await supabase.from("budgets").select("*");
      if (error) throw error;
      const map: Budgets = { ...DEFAULT_BUDGETS };
      (data ?? []).forEach((r) => {
        map[r.category] = Number(r.amount);
      });
      return map;
    },
    enabled: !!user,
  });

  const updateMutation = useMutation({
    mutationFn: async (next: Budgets) => {
      if (!user) return;
      const rows = Object.entries(next).map(([category, amount]) => ({
        user_id: user.id,
        category,
        amount,
      }));
      if (rows.length > 0) {
        const { error } = await supabase
          .from("budgets")
          .upsert(rows, { onConflict: "user_id,category" });
        if (error) throw error;
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
    hydrated: !query.isLoading && (query.isSuccess || !user),
  };
}

function useCustomCategoriesOfKind(kind: "expense" | "income", defaults: string[]) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["custom_categories", kind, user?.id],
    queryFn: async (): Promise<string[]> => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("custom_categories")
        .select("name")
        .eq("kind", kind);
      if (error) throw error;
      return (data ?? []).map((r) => r.name);
    },
    enabled: !!user,
  });

  const custom = query.data ?? [];
  const all = Array.from(new Set([...defaults, ...custom]));

  const addMutation = useMutation({
    mutationFn: async (name: string) => {
      const n = name.trim();
      if (!n || all.includes(n) || !user) return;
      const { error } = await supabase
        .from("custom_categories")
        .insert({ user_id: user.id, kind, name: n });
      if (error) throw error;
      return n;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom_categories", kind, user?.id] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!user) return;
      const { error } = await supabase
        .from("custom_categories")
        .delete()
        .eq("user_id", user.id)
        .eq("kind", kind)
        .eq("name", name);
      if (error) throw error;
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
