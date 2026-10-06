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

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((d) => input.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("contact_messages")
      .insert({ name: data.name, email: data.email, phone: data.phone || null, business: data.business || null, plan: data.plan || null, message: data.message });
    if (error) throw new Error("No se pudo guardar el mensaje");
    try {
      const b64 = (s: string) => btoa(Array.from(new TextEncoder().encode(s), (b) => String.fromCharCode(b)).join(""));
      const hdr = (v: string) => (/^[\x00-\x7F]*$/.test(v) ? v : `=?UTF-8?B?${b64(v)}?=`);
      const clean = (v: string) => v.replace(/[\r\n]/g, " ");
      const body = [
        `Nombre: ${data.name}`,
        `Email: ${data.email}`,
        `Teléfono: ${data.phone || "-"}`,
        `Negocio: ${data.business || "-"}`,
        `Plan: ${data.plan || "-"}`,
        "",
        "Mensaje:",
        data.message,
      ].join("\r\n");
      const raw = [
        "To: atvama0605@gmail.com",
        `Reply-To: ${clean(data.email)}`,
        `Subject: ${hdr(clean(`Nueva solicitud web: ${data.name}${data.business ? ` (${data.business})` : ""}`))}`,
        "MIME-Version: 1.0",
        'Content-Type: text/plain; charset="UTF-8"',
        "Content-Transfer-Encoding: base64",
        "",
        b64(body),
      ].join("\r\n");
      const res = await fetch("https://connector-gateway.lovable.dev/google_mail/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env["LOVABLE_API_KEY"]}`,
          "X-Connection-Api-Key": process.env["GOOGLE_MAIL_API_KEY"] ?? "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw: b64(raw).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "") }),
      });
      if (!res.ok) console.error(`Gmail send failed [${res.status}]: ${await res.text()}`);
    } catch (e) {
      console.error("Gmail send error", e);
    }
    return { reply: `¡Gracias ${data.name}! Hemos recibido tu mensaje y te respondemos en menos de 24 horas.` };
  });

export const getDemo = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: demo } = await supabaseAdmin.from("demos").select("business, html").eq("id", data.id).maybeSingle();
    return demo;
  });
