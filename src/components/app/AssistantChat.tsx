import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { answerDashboardQuery } from "@/lib/dashboard-answers";

type Message = { id: number; sender: "Tú" | "Consultas"; text: string };
const suggestions = [
  "Dame la lista de estudiantes",
  "Mostrame los docentes y sus cursos",
  "Mostrame las solicitudes de ingreso",
  "Mostrame la actividad de supervisión",
  "Mostrame mi perfil",
  "¿Cuántos cupos quedan en total?",
  "Muéstrame los anuncios recientes",
  "¿Qué información del panel podés consultar?",
];

export function AssistantChat({ isAdmin, userId }: { isAdmin: boolean; userId: string }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);

  async function send(question: string) {
    if (!question.trim() || busy) return;
    setInput("");
    setBusy(true);
    setMessages((current) => [...current, { id: Date.now(), sender: "Tú", text: question }]);
    try {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session?.access_token)
        throw new Error("Iniciá sesión para consultar datos internos.");

      // Consultas de datos se resuelven directamente contra Supabase con la sesión
      // actual. RLS mantiene el alcance por rol y evita depender de n8n para leer el panel.
      const dashboardAnswer = await answerDashboardQuery(supabase, question, isAdmin, userId);
      if (dashboardAnswer) {
        setMessages((current) => [
          ...current,
          { id: Date.now() + 1, sender: "Consultas", text: dashboardAnswer },
        ]);
        return;
      }

      // n8n/Groq se conserva para preguntas generales que no corresponden a una
      // consulta estructurada. Los datos personales nunca se envían al modelo.
      const ai = await fetch("/api/internal-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.session.access_token}`,
        },
        body: JSON.stringify({ question }),
      });
      if (ai.ok) {
        const result = (await ai.json()) as { reply: string };
        setMessages((current) => [
          ...current,
          { id: Date.now() + 1, sender: "Consultas", text: result.reply },
        ]);
        return;
      }
      const result = (await ai.json().catch(() => ({}))) as { error?: string };
      throw new Error(
        result.error ??
          "No pude interpretar esa pregunta. Probá pedir cursos, estudiantes, docentes, anuncios, solicitudes, supervisión o perfil.",
      );
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          sender: "Consultas",
          text: `No se pudieron obtener los datos: ${(error as Error).message}`,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex flex-col gap-4" aria-labelledby="consultas-title">
      <div>
        <h1 id="consultas-title" className="text-headline-md font-semibold">
          Consultas
        </h1>
        <p className="text-on-surface-variant">
          Consultá datos del panel según tu rol. Las fichas personales se consultan directamente en
          Supabase y no se envían al modelo de IA.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <Button
            key={s}
            type="button"
            variant="secondary"
            disabled={busy}
            onClick={() => void send(s)}
          >
            {s}
          </Button>
        ))}
      </div>
      <ol
        className="flex min-h-48 flex-col gap-3 rounded-2xl bg-surface-container-low p-4"
        aria-live="polite"
      >
        {messages.map((m) => (
          <li key={m.id} className="whitespace-pre-wrap rounded-xl bg-surface-container-lowest p-3">
            <strong>{m.sender}: </strong>
            {m.text}
          </li>
        ))}
        {busy && <li role="status">Consultando datos…</li>}
      </ol>
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          void send(input);
        }}
        className="flex gap-2"
      >
        <label htmlFor="consultas-input" className="sr-only">
          Escribe una consulta
        </label>
        <input
          id="consultas-input"
          className="form-input flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Preguntá por cualquier sección del panel"
        />
        <Button type="submit" disabled={!input.trim() || busy}>
          Consultar
        </Button>
      </form>
    </section>
  );
}
