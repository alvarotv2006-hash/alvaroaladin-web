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
    return { reply: `¡Gracias ${data.name}! Hemos recibido tu mensaje y te respondemos en menos de 24 horas.` };
  });

export const getDemo = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: demo } = await supabaseAdmin.from("demos").select("business, html").eq("id", data.id).maybeSingle();
    return demo;
  });
