import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { pageItems, PaginationControls } from "./PaginationControls";

type Admission = Database["public"]["Tables"]["admission_requests"]["Row"];
const statuses = [
  ["pendiente", "Pendiente"],
  ["en_revision", "En revisión"],
  ["contactado", "Contactado"],
  ["cerrado", "Cerrado"],
] as const;

export function AdmissionsManager() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const requests = useQuery({
    queryKey: ["admission_requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admission_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
  async function update(row: Admission, status: string) {
    const { data, error } = await supabase.functions.invoke("update-admission-status", {
      body: { requestId: row.id, status },
    });
    if (error) {
      // Keep status management usable while the Edge Function is being deployed.
      const { error: updateError } = await supabase
        .from("admission_requests")
        .update({ status })
        .eq("id", row.id)
        .select("id")
        .single();
      if (updateError) {
        toast.error(updateError.message);
        return;
      }
      toast.warning("Estado actualizado, pero la notificación por correo no está configurada.");
    } else if (data?.emailSent) {
      toast.success("Solicitud actualizada y correo enviado al encargado");
    } else {
      toast.warning(data?.warning ?? "Estado actualizado; el correo no pudo enviarse.");
    }
    await qc.invalidateQueries({ queryKey: ["admission_requests"] });
  }
  const rows = requests.data ?? [];
  const pageRequests = pageItems(rows, page);
  return (
    <section className="space-y-5" aria-labelledby="admissions-title">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Administración</p>
        <h1 id="admissions-title" className="text-headline-md font-semibold">
          Solicitudes de nuevo ingreso
        </h1>
        <p className="text-on-surface-variant">
          Información recibida desde el formulario público de admisión.
        </p>
      </div>
      {requests.isLoading && <p role="status">Cargando solicitudes…</p>}
      {requests.error && (
        <p role="alert" className="text-destructive">
          {requests.error.message}
        </p>
      )}
      {!requests.isLoading && requests.data?.length === 0 && <p>Todavía no hay solicitudes.</p>}
      <ul className="grid gap-4 lg:grid-cols-2">
        {pageRequests.map((row) => (
          <li key={row.id} className="rounded-2xl border bg-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{row.student_name}</h2>
                <p className="text-sm text-on-surface-variant">
                  {row.desired_level} · {new Date(row.created_at).toLocaleDateString("es-CR")}
                </p>
              </div>
              <span className="rounded-full bg-primary-fixed px-2 py-1 text-xs font-semibold">
                {statuses.find(([value]) => value === row.status)?.[1] ?? row.status}
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="font-semibold">Ingreso</dt>
              <dd>{row.entry_type}</dd>
              <dt className="font-semibold">Identificación</dt>
              <dd>{row.student_document}</dd>
              <dt className="font-semibold">Nacimiento</dt>
              <dd>{row.birth_date}</dd>
              <dt className="font-semibold">Encargado</dt>
              <dd>{row.guardian_name}</dd>
              <dt className="font-semibold">Identificación encargado</dt>
              <dd>{row.guardian_document}</dd>
              <dt className="font-semibold">Correo</dt>
              <dd className="break-all">{row.guardian_email}</dd>
              <dt className="font-semibold">Teléfono</dt>
              <dd>{row.guardian_phone}</dd>
            </dl>
            <div className="mt-4">
              <label className="text-sm font-semibold" htmlFor={`admission-${row.id}`}>
                Estado de solicitud
              </label>
              <select
                id={`admission-${row.id}`}
                className="form-input mt-1"
                value={row.status}
                onChange={(event) => void update(row, event.target.value)}
              >
                {statuses.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {row.guardian_email && (
              <Button asChild variant="outline" className="mt-3">
                <a href={`mailto:${row.guardian_email}`}>Contactar encargado</a>
              </Button>
            )}
          </li>
        ))}
      </ul>
      <PaginationControls page={page} total={rows.length} onPageChange={setPage} />
    </section>
  );
}
