import { useState, type ChangeEvent, type FormEvent } from "react";

type Message = { id: string; role: "user" | "assistant"; content: string };

export function useSimpleChat(opts: { api: string; greeting: string }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "initial", role: "assistant", content: opts.greeting },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => setInput(event.target.value);
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setError("");
    setInput("");
    setIsLoading(true);
    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: text };
    const next = [...messages, userMessage];
    setMessages(next);
    try {
      const response = await fetch(opts.api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.filter((message) => message.id !== "initial").slice(-20).map(({ role, content }) => ({ role, content })) }),
      });
      const result = await response.json() as { reply?: string; error?: string };
      if (!response.ok || !result.reply) throw new Error(result.error || "No se pudo obtener una respuesta.");
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: result.reply! }]);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "No se pudo conectar con el asistente.");
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, input, handleInputChange, handleSubmit, isLoading, error };
}
