import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { announcementSchema, fieldErrors } from "@/lib/validation";
import { CrudDialog, FormField } from "./CrudDialog";
import { pageItems, PaginationControls } from "./PaginationControls";

type Ann = Database["public"]["Tables"]["announcements"]["Row"];

export function AnnouncementsManager({ isAdmin, openNew = 0 }: { isAdmin: boolean; openNew?: number }) {
  const qc = useQueryClient();
  const { data = [], isLoading, error } = useQuery({ queryKey: ["announcements"], queryFn: async () => {
    const { data, error } = await supabase.from("announcements").select("*").or("source.is.null,source.neq.newsletter").order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  } });
  const [editing, setEditing] = useState<Ann | "new" | null>(null);
  useEffect(() => { if (openNew > 0 && isAdmin) setEditing("new"); }, [openNew, isAdmin]);
  const [errors, setErrors] = useState<Record<string, string> | null>(null);
  const [page, setPage] = useState(1);
  const pageAnnouncements = pageItems(data, page);

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("announcements").delete().eq("id", id).select("id").single();
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Anuncio eliminado");
      qc.invalidateQueries({ queryKey: ["announcements"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget));
    const errs = fieldErrors(announcementSchema, values);
    setErrors(errs);
    if (errs) return;
    try {
      const parsed = announcementSchema.parse(values);
      const { data: auth } = await supabase.auth.getUser();
      const { error } = editing && editing !== "new"
        ? await supabase.from("announcements").update(parsed).eq("id", editing.id).select("id").single()
        : await supabase.from("announcements").insert({ ...parsed, created_by: auth.user?.id ?? null }).select("id").single();
      if (error) throw error;
      toast.success("Anuncio guardado");
      qc.invalidateQueries({ queryKey: ["announcements"] });
      setEditing(null);
    } catch (err) {
      toast.error((err as Error).message);
    }
  }

  const current = editing && editing !== "new" ? editing : null;

  return (
    <section className="flex flex-col gap-3 py-4" aria-labelledby="ann-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="ann-title" className="text-headline-sm font-semibold">Anuncios institucionales</h2>
        {isAdmin && (
          <Button size="sm" className="rounded-xl" onClick={() => { setErrors(null); setEditing("new"); }}>
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">campaign</span>
            Nuevo anuncio
          </Button>
        )}
      </div>
      {isLoading && <p role="status">Cargando anuncios…</p>}
      {error && <p role="alert" className="text-destructive">{(error as Error).message}</p>}
      {!isLoading && data.length === 0 && <p className="text-on-surface-variant">Aún no hay anuncios.</p>}
      <ul className="grid gap-3 md:grid-cols-2">
        {pageAnnouncements.map((a) => (
          <li key={a.id} className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-label-sm text-on-surface-variant">
                  {a.author_name} • {new Date(a.created_at).toLocaleDateString("es-CR")}
                  {a.source === "n8n" && " • automatizado"}
                </p>
              </div>
              {isAdmin && (
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" aria-label={`Editar anuncio ${a.title}`} onClick={() => { setErrors(null); setEditing(a); }}>
                    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">edit</span>
                  </Button>
                  <Button size="icon" variant="ghost" aria-label={`Eliminar anuncio ${a.title}`} onClick={() => confirm("¿Eliminar este anuncio?") && remove.mutate(a.id)}>
                    <span aria-hidden="true" className="material-symbols-outlined text-[20px]">delete</span>
                  </Button>
                </div>
              )}
            </div>
            <p className="mt-2 text-body-sm">{a.content}</p>
          </li>
        ))}
      </ul>
      <PaginationControls page={page} total={data.length} onPageChange={setPage} />
      {editing && (
        <CrudDialog title={current ? "Editar anuncio" : "Nuevo anuncio"} onClose={() => setEditing(null)}>
          <form noValidate className="flex flex-col gap-3" onSubmit={submit}>
            <FormField id="a-title" label="Título *" error={errors?.["title"]}>
              <input id="a-title" name="title" className="form-input" defaultValue={current?.title} aria-invalid={!!errors?.["title"]} />
            </FormField>
            <FormField id="a-content" label="Contenido *" error={errors?.["content"]}>
              <textarea id="a-content" name="content" rows={4} className="form-input" defaultValue={current?.content} aria-invalid={!!errors?.["content"]} />
            </FormField>
            <FormField id="a-author" label="Autor">
              <input id="a-author" name="author_name" className="form-input" defaultValue={current?.author_name ?? "Dirección"} />
            </FormField>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancelar</Button>
              <Button type="submit">Guardar</Button>
            </div>
          </form>
        </CrudDialog>
      )}
    </section>
  );
}
