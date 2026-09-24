import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { createLovableAiGatewayRunIdFetch } from "@/lib/ai-gateway.server";

async function getAuthedClient(request: Request) {
  const auth = request.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || token.split(".").length !== 3) return null;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: { Authorization: `Bearer ${token}` },
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims?.sub) return null;
  return supabase;
}

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabase = await getAuthedClient(request);
        if (!supabase) return new Response("Unauthorized", { status: 401 });

        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Falta configuración de IA", { status: 500 });

        const { messages } = (await request.json()) as { messages: UIMessage[] };

        const [{ data: courses }, { data: students }, { data: ann }] = await Promise.all([
          supabase.from("courses").select("title, category, level, teacher, schedule, capacity, enrolled"),
          supabase.from("students").select("name, grade, status, score, alert"),
          supabase.from("announcements").select("title, content, created_at").limit(10),
        ]);

        const system = `Eres el asistente institucional del Centro Educativo Adventista de Cartago (Costa Rica).
Responde siempre en español, de forma breve, clara y profesional, usando markdown cuando ayude.
Datos actuales de la plataforma (JSON):
Cursos: ${JSON.stringify(courses ?? [])}
Estudiantes: ${JSON.stringify(students ?? [])}
Anuncios: ${JSON.stringify(ann ?? [])}
Si te piden algo fuera de estos datos, responde con conocimiento general educativo e indica que no proviene de la plataforma.`;

        const runIdFetch = createLovableAiGatewayRunIdFetch();
        const lovable = createOpenAI({
          baseURL: "https://ai.gateway.lovable.dev/v1",
          apiKey: key,
          headers: { "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
          fetch: runIdFetch.fetch,
        });

        const result = streamText({
          model: lovable.responses("openai/gpt-6-astra"),
          system,
          messages: await convertToModelMessages(messages),
          abortSignal: request.signal,
          providerOptions: {
            openai: {
              forceReasoning: true,
              reasoningEffort: "low",
              reasoningSummary: "auto",
              store: false,
              include: ["reasoning.encrypted_content"],
            },
          },
        });
        return result.toUIMessageStreamResponse({
          onError: (e) => (e instanceof Error ? e.message : "Error del asistente"),
        });
      },
    },
  },
});
