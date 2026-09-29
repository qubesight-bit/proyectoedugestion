import { describe, expect, it } from "vitest";
import { handleInternalChat } from "@/lib/internal-chat.server";

describe("asistente interno", () => {
  it("no acepta solicitudes sin sesión", async () => {
    const response = await handleInternalChat(
      new Request("https://ceac.example/api/internal-chat", {
        method: "POST",
        body: JSON.stringify({ question: "¿Cuántas solicitudes hay?" }),
      }),
    );
    expect(response.status).toBe(401);
  });
  it("bloquea llamadas de otro origen", async () => {
    const response = await handleInternalChat(
      new Request("https://ceac.example/api/internal-chat", {
        method: "POST",
        headers: { origin: "https://otro.example" },
        body: "{}",
      }),
    );
    expect(response.status).toBe(403);
  });
});
