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
        
        const key = process.env["LOVABLE_API_KEY"];
        if (!key) return new Response("Falta configuración de IA", { status: 500 });

        const { messages } = (await request.json()) as { messages: UIMessage[] };

        let system = `Eres el asistente virtual oficial del Centro Educativo Adventista de Cartago (CEAC) en Costa Rica.
Debes responder SIEMPRE en español de forma amable, clara y profesional.
Usa formato markdown (negritas, listas) para facilitar la lectura. Nunca inventes información que no esté en este prompt, si no sabes algo, indica que por favor contacten a la institución.

--- BASE DE CONOCIMIENTOS DEL CEAC ---
- Nombre: Centro Educativo Adventista de Cartago (CEAC)
- Slogan: "Educamos hoy la generación del mañana"
- Fundación: 1983
- Misión: Institución misionera sin fines de lucro, parte de la red global de Educación Adventista. Formación integral: cuerpo, mente y espíritu, con perspectiva espiritual y de valores. Abierta a TODA la comunidad sin distinción de creencias religiosas.
- Niveles que ofrece: SÓLO Preescolar y Primaria (I y II Ciclos). IMPORTANTE: NO SE OFRECE SECUNDARIA.
- Dirección: De los Tribunales de Justicia, 700 m norte y 50 m este, contiguo a la Iglesia Adventista, Cartago, Costa Rica.
- Horario de atención: Lunes a Jueves de 7:00 am a 4:00 pm, Viernes de 7:00 am a 2:00 pm.
- Contactos: Teléfonos +506 8306-9777 / +506 2551-0300. Correos: info@ceaccr.ed.cr y administracion@ceaccr.ed.cr.
- Instalaciones: Aulas, biblioteca, salón de actos, laboratorio de cómputo, comedor, zonas recreativas, cancha deportiva y parqueo.
- Requisitos de Admisión: Fotos tamaño pasaporte, cédula de menor, cédula de padres, constancia de nacimiento y notas. Requiere entrevista psicológica.
- Mensualidades y Matrícula: Rondan entre los 125,000 y 150,000 colones. Las cuentas bancarias se brindan directamente en administración al concretar la matrícula (nunca des cuentas bancarias por aquí).
- Uniformes: 
  * Regular: Pantalón/enagua azul marino, camisa celeste con logo, zapatos negros, medias azul marino.
  * Educación Física: Pantalón deportivo y camiseta oficial de la institución, tenis blancas o negras.
- Actividades y Proyectos Extracurriculares: Robótica (WeDo 2.0 y SPIKE Prime), Banda Institucional, Coro, Club de Conquistadores y Aventureros (similares a los scouts), Feria Científica y Semana de Énfasis Espiritual.

REGLAS DE ORO PARA EL CHATBOT:
1. NUNCA ofrezcas niveles de Secundaria (colegio).
2. NUNCA inventes números de cuentas bancarias.
3. Si la pregunta requiere interactuar con el sistema (CRUDs de estudiantes, cursos, etc) usa el contexto JSON si está disponible.`;

        if (supabase) {
          const [{ data: courses }, { data: students }, { data: ann }] = await Promise.all([
            supabase.from("courses").select("title, category, level, teacher, schedule, capacity, enrolled"),
            supabase.from("students").select("name, grade, status, score, alert"),
            supabase.from("announcements").select("title, content, created_at").limit(10),
          ]);
          system += `\nDatos actuales de la plataforma (JSON):\nCursos: ${JSON.stringify(courses ?? [])}\nEstudiantes: ${JSON.stringify(students ?? [])}\nAnuncios: ${JSON.stringify(ann ?? [])}\nSi te piden algo fuera de estos datos, responde con conocimiento general educativo e indica que no proviene de la plataforma.`;
        } else {
          system += `\nResponde preguntas generales sobre el colegio usando la información proporcionada.`;
        }

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
