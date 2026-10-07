import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LogOut, ExternalLink, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChangePassword } from "@/components/ChangePassword";

export const Route = createFileRoute("/_authenticated/cliente")({
  head: () => ({
    meta: [
      { title: "Mi área de cliente — Aladin & Álvaro" },
      { name: "description", content: "Consulta tus solicitudes, tu plan y tu demo." },
      { property: "og:title", content: "Mi área de cliente — Aladin & Álvaro" },
      { property: "og:description", content: "Consulta tus solicitudes, tu plan y tu demo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Cliente,
});

const STATUS_TEXT: Record<string, string> = {
  nuevo: "Recibido — lo estamos revisando",
  contactado: "En marcha — estamos trabajando en ello",
  cerrado: "Finalizado",
};

function Cliente() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const msgs = useQuery({
    queryKey: ["my-messages", user.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").ilike("email", user.email ?? "").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  async function signOut() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  const list = msgs.data ?? [];
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <Link to="/" className="font-bold">Aladin & Álvaro <span className="font-mono text-xs text-muted-foreground">/ mi área</span></Link>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut /> Salir</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-5 py-10">
        <h1 className="text-3xl font-extrabold">Mis solicitudes</h1>
        <p className="mt-2 text-muted-foreground">Aquí verás el estado de tu proyecto y tu demo en cuanto esté lista.</p>
        <div className="mt-8 space-y-4">
          {msgs.isLoading && <p className="text-muted-foreground">Cargando...</p>}
          {!msgs.isLoading && list.length === 0 && (
            <div className="rounded-xl bg-card p-8 text-center shadow-soft">
              <p className="text-muted-foreground">Aún no tienes solicitudes con este email.</p>
              <Button asChild variant="hero" className="mt-4"><Link to="/" hash="contacto">Enviar una solicitud</Link></Button>
            </div>
          )}
          {list.map((m) => (
            <article key={m.id} className="rounded-xl bg-card p-6 shadow-soft">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-mono text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString("es-ES")}</p>
                {m.plan && <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">Plan: {m.plan}</span>}
              </div>
              <p className="mt-3 text-sm font-semibold text-primary">{STATUS_TEXT[m.status] ?? m.status}</p>
              <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
              <div className="mt-5 rounded-lg border border-border p-4">
                {m.demo_url ? (
                  <Button asChild variant="hero"><a href={m.demo_url} target="_blank" rel="noreferrer"><ExternalLink /> Ver mi demo</a></Button>
                ) : (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="size-4" /> Tu demo aparecerá aquí en cuanto la tengamos lista.</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
