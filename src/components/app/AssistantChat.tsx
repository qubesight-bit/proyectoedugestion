import { useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const SUGGESTIONS = [
  "¿Qué cursos tienen menos cupos disponibles?",
  "Resume el estado de los estudiantes",
  "Redacta un anuncio para la reunión de padres",
];

export function AssistantChat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      headers: async (): Promise<Record<string, string>> => {
        const { data } = await supabase.auth.getSession();
        const t = data.session?.access_token;
        return t ? { Authorization: `Bearer ${t}` } : {};
      },
    }),
  });
  const busy = status === "submitted" || status === "streaming";

  function send(text: string) {
    if (!text.trim() || busy) return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <section className="flex h-[calc(100vh-11rem)] flex-col gap-3 py-4 md:h-[calc(100vh-7rem)]" aria-labelledby="ai-title">
      <div>
        <h1 id="ai-title" className="text-headline-md font-semibold">Asistente IA</h1>
        <p className="text-body-sm text-on-surface-variant">Consulta datos de cursos, estudiantes y anuncios.</p>
      </div>
      <div className="flex-1 overflow-y-auto rounded-2xl bg-surface-container-low p-3" aria-live="polite" aria-busy={busy}>
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <Button key={s} variant="secondary" size="sm" className="rounded-full" onClick={() => send(s)}>{s}</Button>
            ))}
          </div>
        )}
        <ul className="flex flex-col gap-3">
          {messages.map((m) => (
            <li key={m.id} className={m.role === "user" ? "self-end max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-primary-foreground" : "max-w-[90%] rounded-2xl bg-surface-container-lowest px-3 py-2 shadow-sm"}>
              <span className="sr-only">{m.role === "user" ? "Tú:" : "Asistente:"}</span>
              {m.parts.map((p, i) =>
                p.type === "text" ? (
                  <div key={i} className="prose prose-sm max-w-none text-inherit [&_*]:text-inherit">
                    <ReactMarkdown>{p.text}</ReactMarkdown>
                  </div>
                ) : null,
              )}
            </li>
          ))}
          {status === "submitted" && <li role="status" className="text-body-sm text-on-surface-variant">Pensando…</li>}
        </ul>
        {error && <p role="alert" className="mt-2 text-destructive">{error.message || "Error del asistente"}</p>}
      </div>
      <form className="flex gap-2" onSubmit={(e: FormEvent) => { e.preventDefault(); send(input); }}>
        <label htmlFor="ai-input" className="sr-only">Mensaje para el asistente</label>
        <input id="ai-input" className="form-input h-11 flex-1" placeholder="Escribe tu pregunta…" value={input} onChange={(e) => setInput(e.target.value)} />
        {busy ? (
          <Button type="button" variant="secondary" onClick={stop}>Detener</Button>
        ) : (
          <Button type="submit" aria-label="Enviar mensaje" disabled={!input.trim()}>
            <span aria-hidden="true" className="material-symbols-outlined">send</span>
          </Button>
        )}
      </form>
    </section>
  );
}
