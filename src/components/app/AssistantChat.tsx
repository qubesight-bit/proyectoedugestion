import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Message = { id: number; sender: "Tú" | "Consultas"; text: string };
const suggestions = ["¿Qué cursos tienen menos cupos disponibles?", "Resume el estado de los estudiantes", "Muéstrame los anuncios recientes"];

export function AssistantChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [busy, setBusy] = useState(false);

  async function send(question: string) {
    if (!question.trim() || busy) return;
    setInput("");
    setBusy(true);
    setMessages((current) => [...current, { id: Date.now(), sender: "Tú", text: question }]);
    try {
      const text = question.toLowerCase();
      let response: string;
      if (/curso|cupo|matr[ií]cula/.test(text)) {
        const { data, error } = await supabase.from("courses").select("title, capacity, enrolled");
        if (error) throw error;
        response = data.length ? data.sort((a,b) => (a.capacity-a.enrolled)-(b.capacity-b.enrolled)).map((c) => `${c.title}: ${Math.max(0,c.capacity-c.enrolled)} cupos libres`).join("\n") : "No hay cursos registrados.";
      } else if (/estudiant|alumn|estado/.test(text)) {
        const { data, error } = await supabase.from("students").select("status");
        if (error) throw error;
        const counts = data.reduce<Record<string, number>>((acc, row) => { acc[row.status] = (acc[row.status] ?? 0) + 1; return acc; }, {});
        response = data.length ? `${data.length} estudiantes registrados. ${Object.entries(counts).map(([status, n]) => `${status}: ${n}`).join("; ")}.` : "No hay estudiantes registrados.";
      } else if (/anuncio|aviso|notific/.test(text)) {
        const { data, error } = await supabase.from("announcements").select("title, content").order("created_at", { ascending: false }).limit(5);
        if (error) throw error;
        response = data.length ? data.map((a) => `${a.title}: ${a.content}`).join("\n\n") : "No hay anuncios publicados.";
      } else {
        response = "Puedo consultar los cursos y sus cupos, el estado de los estudiantes y los anuncios publicados. Elegí una de esas consultas.";
      }
      setMessages((current) => [...current, { id: Date.now() + 1, sender: "Consultas", text: response }]);
    } catch (error) {
      setMessages((current) => [...current, { id: Date.now() + 1, sender: "Consultas", text: `No se pudieron obtener los datos: ${(error as Error).message}` }]);
    } finally { setBusy(false); }
  }

  return <section className="flex flex-col gap-4" aria-labelledby="consultas-title">
    <div><h1 id="consultas-title" className="text-headline-md font-semibold">Consultas</h1><p className="text-on-surface-variant">Consulta información actual de la plataforma.</p></div>
    <div className="flex flex-wrap gap-2">{suggestions.map((s) => <Button key={s} type="button" variant="secondary" disabled={busy} onClick={() => void send(s)}>{s}</Button>)}</div>
    <ol className="flex min-h-48 flex-col gap-3 rounded-2xl bg-surface-container-low p-4" aria-live="polite">{messages.map((m) => <li key={m.id} className="whitespace-pre-wrap rounded-xl bg-surface-container-lowest p-3"><strong>{m.sender}: </strong>{m.text}</li>)}{busy && <li role="status">Consultando datos…</li>}</ol>
    <form onSubmit={(e: FormEvent) => { e.preventDefault(); void send(input); }} className="flex gap-2"><label htmlFor="consultas-input" className="sr-only">Escribe una consulta</label><input id="consultas-input" className="form-input flex-1" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Preguntá por cursos, estudiantes o anuncios" /><Button type="submit" disabled={!input.trim() || busy}>Consultar</Button></form>
  </section>;
}
