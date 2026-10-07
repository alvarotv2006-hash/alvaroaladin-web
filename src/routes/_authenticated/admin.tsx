import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { LogOut, Trash2, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { listUsers, setUserRole, deleteUser } from "@/lib/users.functions";
import { ChangePassword } from "@/components/ChangePassword";

function UsersPanel({ me }: { me: string }) {
  const qc = useQueryClient();
  const list = useServerFn(listUsers);
  const setRole = useServerFn(setUserRole);
  const del = useServerFn(deleteUser);
  const users = useQuery({ queryKey: ["users"], queryFn: () => list() });
  async function run(p: Promise<unknown>, ok: string) {
    try { await p; toast.success(ok); qc.invalidateQueries({ queryKey: ["users"] }); }
    catch (e) { toast.error(e instanceof Error ? e.message : "Error"); }
  }
  return (
    <section className="mt-14">
      <h2 className="text-2xl font-extrabold">Usuarios</h2>
      <div className="mt-4 overflow-x-auto rounded-xl bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="text-left font-mono text-xs uppercase text-muted-foreground">
            <tr><th className="p-3">Email</th><th className="p-3">Alta</th><th className="p-3">Roles</th><th className="p-3 text-right">Acciones</th></tr>
          </thead>
          <tbody>
            {users.isLoading && <tr><td className="p-3 text-muted-foreground" colSpan={4}>Cargando...</td></tr>}
            {(users.data ?? []).map((u) => {
              const isAdmin = u.roles.includes("admin");
              return (
                <tr key={u.id} className="border-t border-border">
                  <td className="p-3">{u.email}{u.id === me && <span className="ml-2 text-xs text-muted-foreground">(tú)</span>}</td>
                  <td className="p-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString("es-ES")}</td>
                  <td className="p-3">{isAdmin ? <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">admin</span> : <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">cliente</span>}</td>
                  <td className="p-3 text-right">
                    {u.id !== me && (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => run(setRole({ data: { userId: u.id, role: "admin", enabled: !isAdmin } }), isAdmin ? "Ahora es cliente" : "Ahora es admin")}>
                          {isAdmin ? "Quitar admin" : "Hacer admin"}
                        </Button>
                        <Button size="icon" variant="ghost" aria-label="Eliminar usuario" onClick={() => { if (confirm(`¿Eliminar a ${u.email}?`)) run(del({ data: { userId: u.id } }), "Usuario eliminado"); }}><Trash2 /></Button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

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
    if (error) { toast.error("No se pudo actualizar"); return; }
    qc.invalidateQueries({ queryKey: ["messages"] });
  }
  async function remove(id: string) {
    if (!confirm("¿Borrar este mensaje?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) { toast.error("No se pudo borrar"); return; }
    qc.invalidateQueries({ queryKey: ["messages"] });
  }
  async function setDemo(id: string, url: string) {
    const { error } = await supabase.from("contact_messages").update({ demo_url: url.trim() || null }).eq("id", id);
    if (error) { toast.error("No se pudo guardar la demo"); return; }
    toast.success(url.trim() ? "Demo adjuntada" : "Demo quitada");
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
                  <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); setDemo(m.id, new FormData(e.currentTarget).get("demo") as string); }}>
                    <input name="demo" type="url" defaultValue={m.demo_url ?? ""} placeholder="Enlace de la demo (el cliente lo verá en su área)" className="h-9 flex-1 rounded-md border border-input bg-background px-3 text-sm" />
                    <Button type="submit" size="sm" variant="soft">Adjuntar demo</Button>
                  </form>
                  <p className="mt-3 font-mono text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString("es-ES")}</p>
                </article>
              ))}
            </div>
             <UsersPanel me={user.id} />
            <div className="mt-14 max-w-xl">
              <ChangePassword />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
