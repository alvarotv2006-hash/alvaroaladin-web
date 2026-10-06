import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const input = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().nullable(),
  business: z.string().trim().max(120).optional().nullable(),
  plan: z.string().max(60).optional().nullable(),
  message: z.string().trim().min(1).max(2000),
});

export const submitAndGenerateDemo = createServerFn({ method: "POST" })
  .inputValidator((d) => input.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: msg, error } = await supabaseAdmin
      .from("contact_messages")
      .insert({ name: data.name, email: data.email, phone: data.phone || null, business: data.business || null, plan: data.plan || null, message: data.message })
      .select("id")
      .single();
    if (error) throw new Error("No se pudo guardar el mensaje");

    const prompt = `Cliente: ${data.name}. Negocio: ${data.business || "no indicado"}. Plan: ${data.plan || "no indicado"}. Mensaje: ${data.message}`;
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env["LOVABLE_API_KEY"]}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content:
              'Eres el asistente del estudio "Aladin & Álvaro" (webs con IA en España, entrega en 12-36h, pago único, 1 año de garantía). Devuelve SOLO JSON {"reply": string, "html": string}. "reply": respuesta cercana en español (3-5 frases) al cliente, mencionando que le habéis preparado una demo y que os pondréis en contacto en menos de 24h. "html": documento HTML completo y autocontenido (CSS en <style>, sin JS ni imágenes externas, usa emojis o degradados) con una landing de demo moderna y responsive para su negocio: cabecera, hero, servicios, sobre nosotros, testimonios, contacto y pie. Todo en español, contenido realista adaptado al negocio.',
          },
          { role: "user", content: prompt },
        ],
      }),
    });
    let reply = `¡Hola ${data.name}! Hemos recibido tu mensaje y te respondemos en menos de 24 horas.`;
    let html = "";
    if (res.ok) {
      try {
        const j = await res.json();
        const parsed = JSON.parse(j.choices[0].message.content);
        reply = String(parsed.reply || reply);
        html = String(parsed.html || "");
      } catch {
        /* fall back */
      }
    }
    if (!html) return { reply, demoId: null as string | null };
    const { data: demo } = await supabaseAdmin
      .from("demos")
      .insert({ message_id: msg.id, business: data.business || data.name, reply, html })
      .select("id")
      .single();
    return { reply, demoId: demo?.id ?? null };
  });

export const getDemo = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: demo } = await supabaseAdmin.from("demos").select("business, html").eq("id", data.id).maybeSingle();
    return demo;
  });
