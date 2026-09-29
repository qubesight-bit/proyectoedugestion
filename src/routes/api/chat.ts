import { createFileRoute } from "@tanstack/react-router";

type ChatMessage = { role: "user" | "assistant"; content: string };

function json(data: object, status = 200) {
  return Response.json(data, { status, headers: { "cache-control": "no-store" } });
}

function validateMessages(value: unknown): ChatMessage[] | null {
  if (!Array.isArray(value) || value.length === 0 || value.length > 20) return null;
  const messages: ChatMessage[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") return null;
    const candidate = entry as Record<string, unknown>;
    if (
      (candidate["role"] !== "user" && candidate["role"] !== "assistant") ||
      typeof candidate["content"] !== "string" ||
      candidate["content"].length > 1500
    )
      return null;
    messages.push({ role: candidate["role"], content: candidate["content"] });
  }
  if (messages.at(-1)?.role !== "user" || !messages.at(-1)?.content.trim()) return null;
  return messages;
}

export async function handleChat(request: Request): Promise<Response> {
  // A public widget must not expose its credential or accept cross-site form posts.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return json({ error: "Origen no permitido" }, 403);
  const url = process.env["N8N_CHAT_WEBHOOK_URL"];
  const secret = process.env["N8N_CHAT_WEBHOOK_SECRET"];
  if (!url || !secret)
    return json({ error: "El chat aún no está configurado en el servidor." }, 503);
  try {
    const parsed = new URL(url);
    if (
      parsed.protocol !== "https:" &&
      !(parsed.protocol === "http:" && ["localhost", "127.0.0.1"].includes(parsed.hostname))
    )
      throw new Error("Insecure webhook");
  } catch {
    return json({ error: "La configuración del chat es inválida." }, 503);
  }
  if (Number(request.headers.get("content-length")) > 40000)
    return json({ error: "Mensaje demasiado largo" }, 413);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ error: "Solicitud inválida" }, 400);
  }
  const messages = validateMessages((payload as { messages?: unknown } | null)?.messages);
  if (!messages) return json({ error: "Conversación inválida" }, 400);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-chat-secret": secret },
      body: JSON.stringify({ messages }),
      signal: AbortSignal.timeout(25000),
    });
    if (!response.ok) {
      if (response.status === 429)
        return json({ error: "El servicio está ocupado. Intentá de nuevo en unos minutos." }, 429);
      console.error("n8n chat request failed", response.status);
      return json({ error: "No se pudo obtener una respuesta del asistente." }, 502);
    }
    const result = (await response.json()) as { reply?: unknown; model?: unknown };
    const reply = typeof result.reply === "string" ? result.reply.trim() : "";
    if (!reply || reply.length > 4000)
      return json({ error: "El asistente respondió sin contenido válido." }, 502);
    return json({ reply, model: typeof result.model === "string" ? result.model : "n8n" });
  } catch (error) {
    console.error("n8n chat network error", error);
    return json({ error: "No se pudo conectar con el asistente." }, 502);
  }
}

export const Route = createFileRoute("/api/chat")({
  server: { handlers: { POST: ({ request }) => handleChat(request) } },
});
