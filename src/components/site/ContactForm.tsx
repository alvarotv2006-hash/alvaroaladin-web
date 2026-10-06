import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle2, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().trim().min(1, "Escribe tu nombre").max(100),
  email: z.string().trim().email("Email no válido").max(255),
  phone: z.string().trim().max(30).optional(),
  business: z.string().trim().max(120).optional(),
  plan: z.string().max(60).optional(),
  message: z.string().trim().min(1, "Cuéntanos qué necesitas").max(2000),
});

export const PLANS = ["Web Exprés", "Web Profesional", "Web + IA", "Solo automatización"];

export function ContactForm({ plan, onPlanChange }: { plan: string; onPlanChange: (p: string) => void }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries()) as Record<string, string>;
    const parsed = schema.safeParse({ ...raw, plan });
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    setSending(true);
    const d = parsed.data;
    const { error } = await supabase.from("contact_messages").insert({
      name: d.name,
      email: d.email,
      phone: d.phone || null,
      business: d.business || null,
      plan: d.plan || null,
      message: d.message,
    });
    setSending(false);
    if (error) {
      toast.error("No se pudo enviar. Inténtalo de nuevo.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-card p-10 text-center shadow-soft">
        <CheckCircle2 className="size-12 text-success" />
        <h3 className="mt-4 text-xl font-bold">¡Mensaje recibido!</h3>
        <p className="mt-2 text-muted-foreground">Te respondemos en menos de 24 horas.</p>
        <Button variant="soft" className="mt-6" onClick={() => setSent(false)}>Enviar otro</Button>
      </div>
    );
  }

  const field = (name: string, label: string, props: React.ComponentProps<typeof Input> = {}) => (
    <div className="space-y-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
      {errors[name] && <p className="text-xs text-destructive">{errors[name]}</p>}
    </div>
  );

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-card p-6 shadow-soft md:p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        {field("name", "Nombre *", { maxLength: 100 })}
        {field("email", "Email *", { type: "email", maxLength: 255 })}
        {field("phone", "Teléfono", { maxLength: 30 })}
        {field("business", "Tu negocio", { maxLength: 120, placeholder: "Peluquería, taller..." })}
      </div>
      <div className="space-y-1.5">
        <Label>Plan que te interesa</Label>
        <div className="flex flex-wrap gap-2">
          {PLANS.map((p) => (
            <button
              type="button"
              key={p}
              onClick={() => onPlanChange(p)}
              className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${plan === p ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:bg-secondary"}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Mensaje *</Label>
        <Textarea id="message" name="message" rows={4} maxLength={2000} />
        {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
      </div>
      <Button type="submit" variant="hero" size="xl" className="w-full" disabled={sending}>
        <Send /> {sending ? "Enviando..." : "Enviar solicitud"}
      </Button>
    </form>
  );
}
