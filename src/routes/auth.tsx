import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailExists } from "@/lib/email-check.functions";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso clientes — Aladin & Álvaro" },
      { name: "description", content: "Entra en tu área de cliente o en el panel del estudio." },
      { property: "og:title", content: "Acceso clientes — Aladin & Álvaro" },
      { property: "og:description", content: "Área privada de clientes del estudio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function goHome(userId: string) {
    const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
    navigate({ to: data ? "/admin" : "/cliente", replace: true });
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { if (data.user) goHome(data.user.id); });
    const { data: sub } = supabase.auth.onAuthStateChange((ev, s) => { if (ev === "SIGNED_IN" && s?.user) goHome(s.user.id); });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (mode === "in") {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) { toast.error("Email o contraseña incorrectos"); return; }
      goHome(data.user.id);
    } else {
      try {
        const { exists } = await emailExists({ data: { email } });
        if (exists) {
          setLoading(false);
          toast.error("Ya existe una cuenta con ese email. Entra con tu contraseña.");
          setMode("in");
          return;
        }
      } catch { /* sigue con el registro */ }
      const { data: su, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/auth" } });
      setLoading(false);
      if (!error && su.user && (su.user.identities?.length ?? 0) === 0) {
        toast.error("Ya existe una cuenta con ese email. Entra con tu contraseña.");
        setMode("in");
        return;
      }
      if (error) {
        const msg = error.message.toLowerCase();
        if (msg.includes("already registered") || msg.includes("already been registered") || msg.includes("user already exists")) {
          toast.error("Ya existe una cuenta con ese email. Entra con tu contraseña.");
          setMode("in");
        } else {
          toast.error(error.message);
        }
        return;
      }
      toast.success("Revisa tu email para confirmar la cuenta");
      setMode("in");
    }
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/auth" });
    if (r.error) toast.error("No se pudo entrar con Google");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-glow px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl bg-card p-8 shadow-soft">
        <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-primary">← Volver a la web</Link>
        <h1 className="text-2xl font-extrabold">{mode === "in" ? "Entrar a mi área" : "Crear cuenta"}</h1>
        <p className="text-sm text-muted-foreground">Usa el mismo email con el que nos escribiste para ver tus solicitudes y tu demo.</p>
        <Button type="button" variant="outline" size="xl" className="w-full" onClick={google}>Continuar con Google</Button>
        <div className="flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />o<span className="h-px flex-1 bg-border" /></div>
        <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
        <div className="space-y-1.5"><Label htmlFor="pw">Contraseña</Label><Input id="pw" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
        <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>{loading ? "..." : mode === "in" ? "Entrar" : "Registrarme"}</Button>
        <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="w-full text-center text-sm text-muted-foreground hover:text-primary">
          {mode === "in" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Entra"}
        </button>
      </form>
    </div>
  );
}
