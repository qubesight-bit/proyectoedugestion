/** Sends an event to the configured n8n webhook. Silently skips when not configured. */
export async function notifyN8n(event: string, payload: Record<string, unknown>) {
  const url = process.env["N8N_WEBHOOK_URL"];
  if (!url) return;
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const secret = process.env["N8N_WEBHOOK_SECRET"];
    if (secret) headers["x-webhook-secret"] = secret;
    await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ event, payload, sent_at: new Date().toISOString() }),
    });
  } catch (e) {
    console.error("n8n notify failed", e);
  }
}
