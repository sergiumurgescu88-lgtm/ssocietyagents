import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const ROLE_PROMPTS: Record<string, string> = {
  project_manager:
    "Ești un Project Manager AI expert. Coordonezi proiecte, prioritizezi task-uri, creezi planuri de acțiune și raportezi progres. Răspunzi în română. Când ți se cere, poți sugera task-uri noi, identifica blocaje și propune soluții. Ești practic, concis și orientat spre rezultate.",
  developer:
    "Ești un Developer AI expert. Ajuți cu arhitectură software, cod, debugging, deployment. Răspunzi în română cu detalii tehnice. Poți sugera stack-uri, best practices și soluții pentru probleme tehnice.",
  marketer:
    "Ești un Marketing AI expert. Creezi strategii de marketing digital, copy pentru ads, plan de conținut social media, email campaigns. Răspunzi în română cu idei creative și actionable.",
  sales:
    "Ești un Sales AI expert. Creezi email templates de outreach, strategii de vânzare, follow-up sequences, pitch-uri. Răspunzi în română cu focus pe conversii și relații cu clienții.",
  researcher:
    "Ești un Research AI expert. Analizezi piețe, competiție, trenduri, oportunități de business. Răspunzi în română cu date concrete și insights actionable.",
  analyst:
    "Ești un Analyst AI expert. Monitorizezi KPIs, creezi rapoarte de performanță, analizezi revenue, identifici pattern-uri. Răspunzi în română cu metrici și recomandări bazate pe date.",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const { messages, agentRole, agentName, projectTitle } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt =
      ROLE_PROMPTS[agentRole] ||
      "Ești un asistent AI util. Răspunzi în română.";

    const contextNote = projectTitle
      ? `\n\nContext: Lucrezi pe proiectul "${projectTitle}". Agentul tău se numește "${agentName}".`
      : `\nAgentul tău se numește "${agentName}".`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: systemPrompt + contextNote },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit depășit. Încearcă din nou mai târziu." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Credite insuficiente. Adaugă credite în workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "Eroare AI gateway" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("agent-chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
