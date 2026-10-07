import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ChangePassword() {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 6) { toast.error("Mínimo 6 caracteres"); return; }
    if (pw !== pw2) { toast.error("Las contraseñas no coinciden"); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setLoading(false);
    if (error) { toast.error("No se pudo cambiar la contraseña"); return; }
    toast.success("Contraseña actualizada");
    setPw(""); setPw2("");
  }

  return (
    <form onSubmit={submit} className="rounded-xl bg-card p-6 shadow-soft">
      <h2 className="text-lg font-bold">Cambiar contraseña</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="npw">Nueva contraseña</Label>
          <Input id="npw" type="password" required minLength={6} value={pw} onChange={(e) => setPw(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="npw2">Repetir contraseña</Label>
          <Input id="npw2" type="password" required minLength={6} value={pw2} onChange={(e) => setPw2(e.target.value)} />
        </div>
      </div>
      <Button type="submit" variant="soft" className="mt-4" disabled={loading}>{loading ? "..." : "Guardar contraseña"}</Button>
    </form>
  );
}
