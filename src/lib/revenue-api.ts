import { supabase } from "@/integrations/supabase/client";

export interface TransactionDB {
  id: string;
  user_id: string;
  project_id: string | null;
  amount: number;
  currency: string;
  source: string;
  category: string;
  description: string | null;
  date: string;
  created_at: string;
}

export interface ExpenseDB {
  id: string;
  user_id: string;
  project_id: string | null;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  created_at: string;
}

export async function fetchTransactions(): Promise<TransactionDB[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("revenue_transactions")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data || []) as TransactionDB[];
}

export async function addTransaction(tx: Omit<TransactionDB, "id" | "user_id" | "created_at">) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase.from("revenue_transactions").insert({ ...tx, user_id: user.id });
  if (error) throw error;
}

export async function fetchExpenses(): Promise<ExpenseDB[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });
  if (error) throw error;
  return (data || []) as ExpenseDB[];
}

export async function addExpense(exp: Omit<ExpenseDB, "id" | "user_id" | "created_at">) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase.from("expenses").insert({ ...exp, user_id: user.id });
  if (error) throw error;
}

export async function deleteExpense(id: string) {
  const { error } = await supabase.from("expenses").delete().eq("id", id);
  if (error) throw error;
}
