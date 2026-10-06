import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acceso administración — Aladin & Álvaro" },
      { name: "description", content: "Acceso al panel de administración del estudio." },
      { property: "og:title", content: "Acceso administración — Aladin & Álvaro" },
      { property: "og:description", content: "Panel privado del estudio." },
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

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error("Email o contraseña incorrectos");
      navigate({ to: "/admin" });
    } else {
      const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin + "/admin" } });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Revisa tu email para confirmar la cuenta");
      setMode("in");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-glow px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-2xl bg-card p-8 shadow-soft">
        <Link to="/" className="font-mono text-xs text-muted-foreground hover:text-primary">← Volver a la web</Link>
        <h1 className="text-2xl font-extrabold">{mode === "in" ? "Entrar al panel" : "Crear cuenta"}</h1>
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
