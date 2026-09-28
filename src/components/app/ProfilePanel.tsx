import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { clearSessionMarks } from "@/lib/session";
import { useAccount } from "./useAccount";

export function ProfilePanel() {
  const { data, label } = useAccount();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  async function saveName() {
    if (!data?.userId || !name.trim()) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({ full_name: name.trim() }).eq("id", data.userId).select("id").single();
    setSaving(false);
    if (error) toast.error(error.message);
    else { await qc.invalidateQueries({ queryKey: ["account"] }); toast.success("Perfil actualizado"); }
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    clearSessionMarks();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <section className="mx-auto flex max-w-md flex-col items-center gap-4 py-10 text-center" aria-labelledby="profile-title">
      <div aria-hidden="true" className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-fixed text-display-lg font-bold text-on-primary-fixed">
        {(data?.fullName || data?.email || "?").charAt(0).toUpperCase()}
      </div>
      <h1 id="profile-title" className="text-headline-md font-semibold">{data?.fullName || "Perfil institucional"}</h1>
      <p className="text-on-surface-variant">{data?.email}</p>
      {label && <span className="rounded-full bg-secondary-container px-3 py-1 text-label-sm font-semibold text-on-secondary-container">{label}</span>}
      <label className="w-full text-left text-sm font-semibold">Nombre para mostrar
        <input className="form-input mt-2" value={name} placeholder={data?.fullName || "Escribe tu nombre"} onChange={(event) => setName(event.target.value)} />
      </label>
      <Button variant="secondary" disabled={!name.trim() || saving} onClick={saveName}>{saving ? "Guardando…" : "Guardar perfil"}</Button>
      <Button variant="destructive" className="mt-4 rounded-xl" onClick={signOut}>
        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">logout</span>
        Cerrar sesión
      </Button>
    </section>
  );
}
