import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LogOut, Trash2, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Panel — Aladin & Álvaro" },
      { name: "description", content: "Gestión de solicitudes de clientes." },
      { property: "og:title", content: "Panel — Aladin & Álvaro" },
      { property: "og:description", content: "Gestión de solicitudes de clientes." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const STATUSES = ["nuevo", "contactado", "cerrado"] as const;

function Admin() {
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const roleQ = useQuery({
    queryKey: ["is-admin", user.id],
    queryFn: async () => {
      const { data } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
      return !!data;
    },
  });

  const msgs = useQuery({
    queryKey: ["messages"],
    enabled: roleQ.data === true,
    queryFn: async () => {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function setStatus(id: string, status: string) {
    const { error } = await supabase.from("contact_messages").update({ status }).eq("id", id);
    if (error) return toast.error("No se pudo actualizar");
    qc.invalidateQueries({ queryKey: ["messages"] });
  }
  async function remove(id: string) {
    if (!confirm("¿Borrar este mensaje?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error("No se pudo borrar");
    qc.invalidateQueries({ queryKey: ["messages"] });
  }
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const list = msgs.data ?? [];
  const counts = STATUSES.map((s) => [s, list.filter((m) => m.status === s).length] as const);

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Link to="/" className="font-bold">Aladin & Álvaro <span className="font-mono text-xs text-muted-foreground">/ panel</span></Link>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="hidden sm:inline">{user.email}</span>
            <Button variant="ghost" size="sm" onClick={signOut}><LogOut /> Salir</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">
        {roleQ.isLoading ? null : !roleQ.data ? (
          <div className="rounded-2xl bg-card p-10 text-center shadow-soft">
            <h1 className="text-xl font-bold">Sin acceso</h1>
            <p className="mt-2 text-muted-foreground">Tu cuenta no tiene permisos de administrador.</p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold">Solicitudes</h1>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {counts.map(([s, n]) => (
                <div key={s} className="rounded-xl bg-card p-5 shadow-soft">
                  <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{s}</p>
                  <p className="mt-1 text-3xl font-extrabold">{n}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 space-y-3">
              {msgs.isLoading && <p className="text-muted-foreground">Cargando...</p>}
              {!msgs.isLoading && list.length === 0 && <p className="rounded-xl bg-card p-8 text-center text-muted-foreground shadow-soft">Aún no hay solicitudes.</p>}
              {list.map((m) => (
                <article key={m.id} className="rounded-xl bg-card p-5 shadow-soft">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold">{m.name} {m.business && <span className="font-normal text-muted-foreground">· {m.business}</span>}</h2>
                      <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <a href={`mailto:${m.email}`} className="flex items-center gap-1 hover:text-primary"><Mail className="size-3.5" />{m.email}</a>
                        {m.phone && <a href={`tel:${m.phone}`} className="flex items-center gap-1 hover:text-primary"><Phone className="size-3.5" />{m.phone}</a>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {m.plan && <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">{m.plan}</span>}
                      <select value={m.status} onChange={(e) => setStatus(m.id, e.target.value)} className="h-8 rounded-md border border-input bg-background px-2 text-sm">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <Button variant="ghost" size="icon" onClick={() => remove(m.id)} aria-label="Borrar"><Trash2 /></Button>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
                  <p className="mt-3 font-mono text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString("es-ES")}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
