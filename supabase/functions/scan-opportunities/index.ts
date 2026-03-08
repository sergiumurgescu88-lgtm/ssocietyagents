import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Simple in-memory rate limiter (per function instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5; // max scans per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Extract user from auth header for rate limiting
    const authHeader = req.headers.get("Authorization");
    let userId = "anonymous";
    if (authHeader) {
      try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
        const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
        const supabase = createClient(supabaseUrl, supabaseKey, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data: { user } } = await supabase.auth.getUser();
        if (user) userId = user.id;
      } catch { /* ignore auth errors for rate limit key */ }
    }

    if (!checkRateLimit(userId)) {
      return new Response(JSON.stringify({ error: "Ai atins limita de scanări (5/oră). Încearcă mai târziu." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { category, userSkills } = await req.json();

    const systemPrompt = `Ești un analist de business expert. Generează oportunități de afaceri profitabile și realiste.

Răspunde DOAR folosind tool-ul generate_opportunities. Generează exact 8 oportunități diverse și actuale.

Categorii posibile: ecommerce, saas, content, affiliate, consulting, crypto, stocks, freelancing.
Effort levels: low, medium, high.
Profit scores: 1-100 (bazat pe potențial real de profit vs competiție).

Fiecare oportunitate trebuie să aibă:
- Titlu scurt și descriptiv în română
- Descriere de 2-3 propoziții cu date concrete
- Revenue estimates realiste (min/max lunar în USD)
- Tags relevante (skills necesare)
- Surse credibile (Market Analysis, Trend Scanner, Community Intel, Industry Report)
- Trend (growing, stable, emerging, declining)

${category && category !== 'all' ? `Focus pe categoria: ${category}` : 'Mix de categorii diverse.'}
${userSkills?.length ? `Skill-urile user-ului: ${userSkills.join(', ')}. Prioritizează oportunități potrivite.` : ''}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Generează oportunități de business pentru ${new Date().toLocaleDateString('ro-RO')}. Include trenduri actuale din piață.` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_opportunities",
              description: "Generate business opportunities",
              parameters: {
                type: "object",
                properties: {
                  opportunities: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        description: { type: "string" },
                        profit_score: { type: "number" },
                        effort_level: { type: "string", enum: ["low", "medium", "high"] },
                        estimated_revenue_min: { type: "number" },
                        estimated_revenue_max: { type: "number" },
                        category: { type: "string" },
                        tags: { type: "array", items: { type: "string" } },
                        source: { type: "string" },
                        trend: { type: "string", enum: ["growing", "stable", "emerging", "declining"] },
                      },
                      required: ["title", "description", "profit_score", "effort_level", "estimated_revenue_min", "estimated_revenue_max", "category", "tags", "source", "trend"],
                      additionalProperties: false,
                    },
                  },
                },
                required: ["opportunities"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_opportunities" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit atins. Încearcă din nou mai târziu." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Credit insuficient. Adaugă fonduri în workspace." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in response");

    const parsed = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("scan error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
