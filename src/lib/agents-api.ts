import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type DbProjectAgent = Database["public"]["Tables"]["project_agents"]["Row"];
export type DbAgentLog = Database["public"]["Tables"]["agent_logs"]["Row"];
export type DbAgentConversation = Database["public"]["Tables"]["agent_conversations"]["Row"];

// Fetch all agents for current user (across all projects)
export async function fetchAllAgents() {
  const { data, error } = await supabase
    .from("project_agents")
    .select("*, projects(title, status)")
    .order("created_at", { ascending: false });
  return { data, error };
}

// Fetch agent detail with logs and conversations
export async function fetchAgentDetail(agentId: string) {
  const [agentRes, logsRes, convRes, tasksRes] = await Promise.all([
    supabase.from("project_agents").select("*, projects(title, status)").eq("id", agentId).single(),
    supabase.from("agent_logs").select("*").eq("agent_id", agentId).order("created_at", { ascending: false }).limit(50),
    supabase.from("agent_conversations").select("*").eq("agent_id", agentId).order("created_at", { ascending: true }),
    supabase.from("tasks").select("*").eq("agent_id", agentId).order("created_at", { ascending: false }),
  ]);
  return {
    agent: agentRes.data,
    logs: logsRes.data ?? [],
    conversations: convRes.data ?? [],
    tasks: tasksRes.data ?? [],
    error: agentRes.error,
  };
}

// Save conversation message
export async function saveConversationMessage(data: {
  agent_id: string;
  user_id: string;
  role: "user" | "assistant";
  content: string;
}) {
  return supabase.from("agent_conversations").insert(data);
}

// Create agent log
export async function createAgentLog(data: {
  agent_id: string;
  user_id: string;
  action_type: string;
  details?: Record<string, string | number | boolean | null>;
}) {
  return supabase.from("agent_logs").insert([data as any]);
}

// Update agent status
export async function updateAgentStatus(agentId: string, status: string) {
  return supabase.from("project_agents").update({ status }).eq("id", agentId);
}

// Delete agent
export async function deleteAgent(agentId: string) {
  return supabase.from("project_agents").delete().eq("id", agentId);
}

// Stream chat with agent via edge function
export async function streamAgentChat({
  messages,
  agentRole,
  agentName,
  projectTitle,
  onDelta,
  onDone,
  onError,
}: {
  messages: { role: "user" | "assistant"; content: string }[];
  agentRole: string;
  agentName: string;
  projectTitle?: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent-chat`;

  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages, agentRole, agentName, projectTitle }),
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      onError(errData.error || `Eroare: ${resp.status}`);
      return;
    }

    if (!resp.body) {
      onError("Nu s-a putut deschide stream-ul");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);
        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;
        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") { streamDone = true; break; }
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    // Final flush
    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore */ }
      }
    }

    onDone();
  } catch (e) {
    onError(e instanceof Error ? e.message : "Eroare necunoscută");
  }
}
