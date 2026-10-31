// Categorias são strings livres: defaults + customizadas pelo usuário
export type Category = string;

export const DEFAULT_CATEGORIES: Category[] = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Lazer",
  "Saúde",
  "Educação",
  "Vestuário",
  "Contas",
  "Investimentos",
  "Outros",
];

/** @deprecated Use useCategories() para incluir categorias customizadas */
export const CATEGORIES = DEFAULT_CATEGORIES;

export type Expense = {
  id: string;
  date: string;
  description: string;
  category: Category;
  payment: string;
  amount: number;
};

export type Budgets = Record<string, number>;

export const DEFAULT_BUDGETS: Budgets = {
  "Alimentação": 800,
  "Transporte": 400,
  "Moradia": 1500,
  "Lazer": 300,
  "Saúde": 250,
  "Educação": 200,
  "Vestuário": 150,
  "Contas": 450,
  "Investimentos": 600,
  "Outros": 200,
};

export const PAYMENT_METHODS = [
  "Dinheiro",
  "Pix",
  "Cartão de Débito",
  "Cartão de Crédito",
  "Transferência",
  "Débito Automático",
  "Boleto",
];

export type IncomeCategory = string;

export const DEFAULT_INCOME_CATEGORIES: IncomeCategory[] = [
  "Salário",
  "Freelance",
  "Vendas",
  "Aluguel recebido",
  "Rendimentos",
  "Reembolso",
  "Presente",
  "Outros",
];

/** @deprecated Use useIncomeCategories() */
export const INCOME_CATEGORIES = DEFAULT_INCOME_CATEGORIES;

export type Income = {
  id: string;
  date: string;
  description: string;
  category: IncomeCategory;
  source: string;
  amount: number;
};

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const monthLabel = (m: number) =>
  ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"][m];

/**
 * Decompõe uma string de data 'YYYY-MM-DD' em { year, month (0-11), day } de forma segura,
 * evitando qualquer distorção de fuso horário / UTC.
 */
export function parseDateParts(dateStr: string): { year: number; month: number; day: number } {
  if (!dateStr) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate() };
  }
  const parts = dateStr.slice(0, 10).split("-").map(Number);
  if (parts.length < 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) {
    const d = new Date(dateStr);
    return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate() };
  }
  return {
    year: parts[0],
    month: parts[1] - 1, // 0-indexed para compatibilidade com Date.getMonth()
    day: parts[2],
  };
}

/**
 * Formata 'YYYY-MM-DD' para 'DD/MM/YYYY' sem deslocamento de timezone.
 */
export function formatDateBR(dateStr: string): string {
  const { day, month, year } = parseDateParts(dateStr);
  const dd = String(day).padStart(2, "0");
  const mm = String(month + 1).padStart(2, "0");
  return `${dd}/${mm}/${year}`;
}

/**
 * Verifica se a data 'YYYY-MM-DD' pertence ao ano e mês (0-11) especificados.
 */
export function isSameMonth(dateStr: string, year: number, month: number): boolean {
  const parts = parseDateParts(dateStr);
  return parts.year === year && parts.month === month;
}

/**
 * Converte input monetário flexível (ex: '1.250,50' ou '1250.50' ou '1250,50') em número válido positivo.
 */
export function parseCurrency(value: string): number {
  if (typeof value !== "string") return Number(value) || 0;
  const clean = value.trim().replace(/[^\d.,-]/g, "");
  if (!clean) return 0;
  if (clean.includes(",") && clean.includes(".")) {
    const normalized = clean.replace(/\./g, "").replace(",", ".");
    const num = parseFloat(normalized);
    return isNaN(num) || num < 0 ? 0 : num;
  }
  if (clean.includes(",")) {
    const num = parseFloat(clean.replace(",", "."));
    return isNaN(num) || num < 0 ? 0 : num;
  }
  const num = parseFloat(clean);
  return isNaN(num) || num < 0 ? 0 : num;
}
