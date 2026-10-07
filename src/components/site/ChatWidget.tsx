import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { Bot, X, Send } from "lucide-react";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/public/chat" }),
  });
  const busy = status === "submitted" || status === "streaming";
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const t = input.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
    setInput("");
  }

  return (
    <>
      <button onClick={() => setOpen(!open)} aria-label="Abrir asistente" className="fixed bottom-24 right-5 z-50 grid size-14 place-items-center rounded-full bg-foreground text-background shadow-soft transition-transform hover:scale-105">
        {open ? <X /> : <Bot />}
      </button>
      {open && (
        <div className="fixed bottom-44 right-5 z-50 flex h-[28rem] w-[min(22rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <span className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground"><Bot className="size-4" /></span>
            <div><p className="text-sm font-bold">Ali · asistente</p><p className="text-xs text-muted-foreground">Pregúntame por precios, plazos...</p></div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.length === 0 && <p className="text-muted-foreground">¡Hola! 👋 Soy Ali. ¿En qué te ayudo con tu web?</p>}
            {messages.map((m) => {
              const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
              if (!text) return null;
              return m.role === "user" ? (
                <div key={m.id} className="ml-auto max-w-[85%] rounded-2xl bg-primary px-3 py-2 text-primary-foreground">{text}</div>
              ) : (
                <div key={m.id} className="prose prose-sm max-w-[95%] text-foreground"><ReactMarkdown>{text}</ReactMarkdown></div>
              );
            })}
            {status === "submitted" && <p className="text-muted-foreground">Escribiendo...</p>}
            {error && <p className="text-destructive">No he podido responder. Inténtalo de nuevo en un momento.</p>}
            <div ref={endRef} />
          </div>
          <form onSubmit={submit} className="flex gap-2 border-t border-border p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe tu pregunta..." className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Enviar" className="grid size-10 place-items-center rounded-md bg-primary text-primary-foreground disabled:opacity-50"><Send className="size-4" /></button>
          </form>
        </div>
      )}
    </>
  );
}
