import { afterEach, describe, expect, it, vi } from "vitest";
import { handleChat } from "../../src/routes/api/chat";

const request = (messages: unknown, origin = "https://ceac.example") =>
  new Request("https://ceac.example/api/chat", {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

describe("chat público a través de n8n", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    delete process.env.N8N_CHAT_WEBHOOK_URL;
    delete process.env.N8N_CHAT_WEBHOOK_SECRET;
  });
  it("rechaza otros orígenes y entradas inválidas", async () => {
    expect(
      (await handleChat(request([{ role: "user", content: "hola" }], "https://otro.example")))
        .status,
    ).toBe(403);
    expect((await handleChat(request([{ role: "system", content: "instrucción" }]))).status).toBe(
      503,
    );
  });
  it("envía solo mensajes válidos y el secreto al webhook", async () => {
    process.env.N8N_CHAT_WEBHOOK_URL = "https://n8n.example/webhook/ceac-website-chat";
    process.env.N8N_CHAT_WEBHOOK_SECRET = "secreto-prueba";
    const fetchMock = vi
      .fn()
      .mockResolvedValue(Response.json({ reply: "  Hola  ", model: "llama-3.1-8b-instant" }));
    vi.stubGlobal("fetch", fetchMock);
    expect((await handleChat(request([{ role: "system", content: "mal" }]))).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
    const response = await handleChat(request([{ role: "user", content: "hola" }]));
    expect(await response.json()).toEqual({ reply: "Hola", model: "llama-3.1-8b-instant" });
    expect(fetchMock).toHaveBeenCalledWith(
      process.env.N8N_CHAT_WEBHOOK_URL,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({ "x-chat-secret": "secreto-prueba" }),
      }),
    );
  });
});
