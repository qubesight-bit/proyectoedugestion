import { afterEach, describe, expect, it, vi } from "vitest";

const state = vi.hoisted(() => ({
  user: { data: { user: { id: "u-1" } }, error: null },
  roles: [{ role: "admin" }],
  records: {} as Record<string, Array<Record<string, unknown>>>,
}));
vi.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    auth: { getUser: async () => state.user },
    from: (table: string) => ({
      select: () => ({
        eq: async () => ({
          data: table === "user_roles" ? state.roles : (state.records[table] ?? []),
          error: null,
        }),
        order: () => ({ limit: async () => ({ data: state.records[table] ?? [], error: null }) }),
        then: (resolve: (value: unknown) => void) =>
          resolve({ data: state.records[table] ?? [], error: null }),
      }),
    }),
  }),
}));
import { handleInternalChat } from "@/lib/internal-chat.server";

describe("acceso del asistente interno", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_PUBLISHABLE_KEY;
    delete process.env.N8N_INTERNAL_CHAT_WEBHOOK_URL;
    delete process.env.N8N_CHAT_WEBHOOK_SECRET;
    state.roles = [{ role: "admin" }];
    state.records = {};
  });
  it("deniega cuenta sin rol antes de llamar al webhook", async () => {
    process.env.SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_PUBLISHABLE_KEY = "publishable";
    process.env.N8N_INTERNAL_CHAT_WEBHOOK_URL = "https://n8n.example/webhook/internal";
    process.env.N8N_CHAT_WEBHOOK_SECRET = "secret";
    state.roles = [{ role: "estudiante" }];
    const webhook = vi.fn();
    vi.stubGlobal("fetch", webhook);
    const response = await handleInternalChat(
      new Request("https://ceac.example/api/internal-chat", {
        method: "POST",
        headers: { Authorization: "Bearer user-jwt" },
        body: JSON.stringify({ question: "¿Cuántos estudiantes hay?" }),
      }),
    );
    expect(response.status).toBe(403);
    expect(webhook).not.toHaveBeenCalled();
  });
  it("envía agregados internos sin datos personales", async () => {
    process.env.SUPABASE_URL = "https://test.supabase.co";
    process.env.SUPABASE_PUBLISHABLE_KEY = "publishable";
    process.env.N8N_INTERNAL_CHAT_WEBHOOK_URL = "https://n8n.example/webhook/internal";
    process.env.N8N_CHAT_WEBHOOK_SECRET = "secret";
    state.roles = [{ role: "admin" }];
    state.records = {
      courses: [{ id: "c1", title: "Matemáticas", capacity: 20, enrolled: 12 }],
      students: [{ status: "Activo", name: "Nombre privado" }],
      announcements: [{ title: "Reunión", content: "Viernes" }],
      admission_requests: [{ status: "pendiente", guardian_email: "privado@example.com" }],
    };
    const webhook = vi
      .fn()
      .mockResolvedValue(Response.json({ reply: "Hay 1 solicitud pendiente." }));
    vi.stubGlobal("fetch", webhook);
    const response = await handleInternalChat(
      new Request("https://ceac.example/api/internal-chat", {
        method: "POST",
        headers: { Authorization: "Bearer user-jwt" },
        body: JSON.stringify({ question: "¿Qué situación institucional ves hoy?" }),
      }),
    );
    expect(response.status).toBe(200);
    const sent = webhook.mock.calls[0]?.[1]?.body as string;
    expect(sent).toContain('"pendiente":1');
    expect(sent).toContain('"available":8');
    expect(sent).not.toContain("Nombre privado");
    expect(sent).not.toContain("privado@example.com");
  });
});
