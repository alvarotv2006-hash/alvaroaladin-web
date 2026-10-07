import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, type UIMessage } from "ai";
import { createResponsesCall } from "@/server/ai/responses";

const INSTRUCTIONS = `Eres "Ali", el asistente de Aladin & Álvaro (AI & Web Studio), un estudio que crea páginas web y automatizaciones con IA para negocios en España.
Responde siempre en español, breve (máx. 120 palabras), cercano y claro.
Datos: web lista en 12 a 36 horas; pago único sin cuotas; 1 año de garantía; trato directo con los desarrolladores (Aladin: IA y automatizaciones; Álvaro: diseño y frontend).
Tarifas orientativas: Web Exprés 290€, Profesional 490€ (la más elegida), Web + IA 890€ (incluye asistente IA/automatizaciones).
Contacto: formulario de la web o email atvama0605@gmail.com. Los clientes pueden entrar en su área de cliente para ver el estado de su solicitud y su demo.
Si no sabes algo, no lo inventes: invita a escribir por el formulario o email. No hables de temas ajenos al estudio.`;

export const Route = createFileRoute("/api/public/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("Chat no configurado", { status: 500 });
        let body: { messages?: UIMessage[] };
        try { body = await request.json(); } catch { return new Response("Bad request", { status: 400 }); }
        const messages = (body.messages ?? []).slice(-20);
        if (!messages.length) return new Response("Bad request", { status: 400 });
        const model = await convertToModelMessages(messages);
        return createResponsesCall(
          request,
          { baseURL: "https://ai.gateway.lovable.dev/v1", apiKey, model: "openai/gpt-6-astra" },
          model,
          INSTRUCTIONS,
        ).response();
      },
    },
  },
});
