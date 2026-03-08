import { supabase } from "@/integrations/supabase/client";

export interface OpportunityDB {
  id: string;
  user_id: string;
  title: string;
  description: string;
  profit_score: number;
  effort_level: string;
  estimated_revenue_min: number;
  estimated_revenue_max: number;
  sources: any;
  tags: string[];
  category: string;
  trend: string;
  is_new: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface UserOpportunity {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: string;
  rated_score: number | null;
  created_at: string;
}

export async function fetchOpportunities() {
  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as OpportunityDB[];
}

export async function fetchUserOpportunities() {
  const { data, error } = await supabase
    .from("user_opportunities")
    .select("*");
  if (error) throw error;
  return data as UserOpportunity[];
}

export async function saveOpportunity(opportunityId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase.from("user_opportunities").insert({
    user_id: user.id,
    opportunity_id: opportunityId,
    status: "saved",
  });
  if (error) throw error;
}

export async function dismissOpportunity(opportunityId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase.from("user_opportunities").upsert({
    user_id: user.id,
    opportunity_id: opportunityId,
    status: "dismissed",
  }, { onConflict: "user_id,opportunity_id" });
  if (error) throw error;
}

export async function startProjectFromOpportunity(opportunityId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const { error } = await supabase.from("user_opportunities").upsert({
    user_id: user.id,
    opportunity_id: opportunityId,
    status: "started",
  }, { onConflict: "user_id,opportunity_id" });
  if (error) throw error;
}

export async function scanForOpportunities(category?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get user skills from profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("skills")
    .eq("user_id", user.id)
    .single();

  const { data, error } = await supabase.functions.invoke("scan-opportunities", {
    body: { category: category || "all", userSkills: profile?.skills || [] },
  });

  if (error) throw error;
  if (data?.error) throw new Error(data.error);

  // Save opportunities to DB
  const opportunities = data.opportunities || [];
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const rows = opportunities.map((opp: any) => ({
    user_id: user.id,
    title: opp.title,
    description: opp.description,
    profit_score: opp.profit_score,
    effort_level: opp.effort_level,
    estimated_revenue_min: opp.estimated_revenue_min,
    estimated_revenue_max: opp.estimated_revenue_max,
    sources: [{ name: opp.source, url: "" }],
    tags: opp.tags,
    category: opp.category,
    trend: opp.trend,
    is_new: true,
    expires_at: expiresAt.toISOString(),
  }));

  if (rows.length > 0) {
    const { error: insertError } = await supabase.from("opportunities").insert(rows);
    if (insertError) throw insertError;
  }

  // Log the scan
  await supabase.from("scan_logs").insert({
    user_id: user.id,
    sources_used: ["AI Scanner"],
    opportunities_found: rows.length,
  });

  return rows.length;
}
