import { useState, type ChangeEvent, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";

/** Wrapper that exposes a simple input/submit API over the current AI SDK useChat. */
export function useSimpleChat(opts: { api: string; greeting: string }) {
  const [input, setInput] = useState("");
  const initial: UIMessage[] = [
    { id: "initial", role: "assistant", parts: [{ type: "text", text: opts.greeting }] },
  ];
  const chat = useChat({
    transport: new DefaultChatTransport({ api: opts.api }),
    messages: initial,
  });
  const messages = chat.messages.map((m) => ({
    id: m.id,
    role: m.role,
    content: m.parts
      .map((p) => (p.type === "text" ? p.text : ""))
      .join(""),
  }));
  const isLoading = chat.status === "submitted" || chat.status === "streaming";
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");
    void chat.sendMessage({ text });
  };
  return { messages, input, handleInputChange, handleSubmit, isLoading };
}
