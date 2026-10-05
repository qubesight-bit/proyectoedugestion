import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { CrudDialog, FormField } from "./CrudDialog";
import { pageItems, PaginationControls } from "./PaginationControls";

type Ann = Database["public"]["Tables"]["announcements"]["Row"];

const MOCK_NEWSLETTER: Ann[] = [
  {
    id: "mock-news-1",
    title: "Inicio del III trimestre académico",
    content: "La Dirección informa a estudiantes y familias que el III trimestre académico inicia el lunes 12 de octubre. Se solicita puntualidad y portar los materiales correspondientes desde el primer día.",
    author_name: "Dirección Académica",
    source: "newsletter",
    created_at: "2026-10-04T14:00:00.000Z",
    updated_at: "2026-10-04T14:00:00.000Z",
    created_by: null,
  },
  {
    id: "mock-news-2",
    title: "Jornada institucional de salud y bienestar",
    content: "El próximo viernes se realizará una jornada institucional de salud y bienestar con actividades de prevención, nutrición y hábitos saludables. Los horarios específicos serán comunicados por cada docente.",
    author_name: "Coordinación Institucional",
    source: "newsletter",
    created_at: "2026-10-02T16:30:00.000Z",
    updated_at: "2026-10-02T16:30:00.000Z",
    created_by: null,
  },
  {
    id: "mock-news-3",
    title: "Recordatorio sobre actualización de datos",
    content: "Solicitamos a las familias verificar que los números telefónicos, correos electrónicos y datos de contacto de emergencia estén actualizados en la plataforma institucional.",
    author_name: "Secretaría",
    source: "newsletter",
    created_at: "2026-09-29T13:15:00.000Z",
    updated_at: "2026-09-29T13:15:00.000Z",
    created_by: null,
  },
  {
    id: "mock-news-4",
    title: "Feria de proyectos estudiantiles",
    content: "Se invita a toda la comunidad educativa a la Feria de Proyectos Estudiantiles. Los grupos presentarán trabajos de ciencias, tecnología, arte y emprendimiento desarrollados durante el trimestre.",
    author_name: "Dirección",
    source: "newsletter",
    created_at: "2026-09-25T15:45:00.000Z",
    updated_at: "2026-09-25T15:45:00.000Z",
    created_by: null,
  },
];

export function NewsletterManager({ isAdmin }: { isAdmin: boolean }) {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Ann | "new" | null>(null);
  const [page, setPage] = useState(1);

  const newsletters = useQuery({
    queryKey: ["newsletter"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .eq("source", "newsletter")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("announcements").delete().eq("id", id).eq("source", "newsletter");
      if (error) throw error;
    },
    onSuccess: async () => {
      toast.success("Comunicado eliminado");
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["newsletter"] }),
        qc.invalidateQueries({ queryKey: ["announcements"] }),
      ]);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    const content = String(form.get("content") ?? "").trim();
    const authorName = String(form.get("author_name") ?? "").trim() || "Dirección";

    if (title.length < 3 || content.length < 5) {
      toast.error("Ingresá un título y un contenido válidos.");
      return;
    }

    try {
      const { data: auth } = await supabase.auth.getUser();
      const payload = { title, content, author_name: authorName, source: "newsletter" };

      const { error } = editing && editing !== "new"
        ? await supabase.from("announcements").update(payload).eq("id", editing.id).eq("source", "newsletter")
        : await supabase.from("announcements").insert({ ...payload, created_by: auth.user?.id ?? null });

      if (error) throw error;
      toast.success(editing === "new" ? "Comunicado publicado" : "Comunicado actualizado");
      setEditing(null);
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["newsletter"] }),
        qc.invalidateQueries({ queryKey: ["announcements"] }),
      ]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "No se pudo guardar el comunicado.");
    }
  }

  const data = newsletters.data?.length ? newsletters.data : MOCK_NEWSLETTER;
  const current = editing && editing !== "new" ? editing : null;
  const visible = pageItems(data, page);

  return <section className="space-y-5" aria-labelledby="newsletter-title">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Información institucional</p>
        <h1 id="newsletter-title" className="text-headline-md font-semibold">Newsletter y comunicados oficiales</h1>
        <p className="text-on-surface-variant">Circulares, avisos de Dirección y comunicaciones oficiales del centro educativo.</p>
      </div>
      {isAdmin && <Button onClick={() => setEditing("new")}>
        <span aria-hidden="true" className="material-symbols-outlined text-[20px]">edit_square</span>
        Nuevo comunicado
      </Button>}
    </div>

    {newsletters.isLoading && <p role="status">Cargando comunicados…</p>}
    {newsletters.error && <p role="alert" className="text-destructive">{newsletters.error.message}</p>}
    {!newsletters.isLoading && data.length === 0 && <div className="rounded-2xl bg-surface-container-lowest p-6 text-center shadow-sm">
      <span aria-hidden="true" className="material-symbols-outlined text-4xl text-primary">newspaper</span>
      <h2 className="mt-2 font-semibold">No hay comunicados publicados</h2>
      <p className="text-sm text-on-surface-variant">Los comunicados oficiales aparecerán aquí.</p>
    </div>}

    <div className="space-y-4">
      {visible.map((item) => <article key={item.id} className="overflow-hidden rounded-2xl bg-surface-container-lowest shadow-sm">
        <div className="border-b bg-surface-container px-5 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary-fixed px-3 py-1 text-xs font-semibold text-on-primary-fixed">
                <span aria-hidden="true" className="material-symbols-outlined text-[16px]">verified</span>
                Comunicado oficial
              </span>
              {item.id.startsWith("mock-news-") && <span className="rounded-full bg-surface-container-high px-2 py-1 text-xs font-semibold text-on-surface-variant">Demo</span>}
            </div>
            <time className="text-sm text-on-surface-variant">{new Date(item.created_at).toLocaleDateString("es-CR", { dateStyle: "long" })}</time>
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">{item.title}</h2>
              <p className="mt-1 text-sm text-on-surface-variant">Emitido por {item.author_name || "Dirección"}</p>
            </div>
            {isAdmin && !item.id.startsWith("mock-news-") && <div className="flex shrink-0 gap-1">
              <Button size="icon" variant="ghost" aria-label={`Editar ${item.title}`} onClick={() => setEditing(item)}>
                <span aria-hidden="true" className="material-symbols-outlined">edit</span>
              </Button>
              <Button size="icon" variant="ghost" aria-label={`Eliminar ${item.title}`} onClick={() => confirm("¿Eliminar este comunicado oficial?") && remove.mutate(item.id)}>
                <span aria-hidden="true" className="material-symbols-outlined">delete</span>
              </Button>
            </div>}
          </div>
          <p className="mt-4 whitespace-pre-wrap leading-7">{item.content}</p>
        </div>
      </article>)}
    </div>

    <PaginationControls page={page} total={data.length} onPageChange={setPage} />

    {editing && <CrudDialog title={current ? "Editar comunicado" : "Nuevo comunicado oficial"} onClose={() => setEditing(null)}>
      <form className="flex flex-col gap-3" onSubmit={submit}>
        <FormField id="newsletter-title-input" label="Título *">
          <input id="newsletter-title-input" name="title" required minLength={3} className="form-input" defaultValue={current?.title ?? ""} />
        </FormField>
        <FormField id="newsletter-content" label="Contenido *">
          <textarea id="newsletter-content" name="content" required minLength={5} rows={8} className="form-input" defaultValue={current?.content ?? ""} />
        </FormField>
        <FormField id="newsletter-author" label="Emisor">
          <input id="newsletter-author" name="author_name" className="form-input" defaultValue={current?.author_name ?? "Dirección"} />
        </FormField>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => setEditing(null)}>Cancelar</Button>
          <Button type="submit">{current ? "Guardar cambios" : "Publicar comunicado"}</Button>
        </div>
      </form>
    </CrudDialog>}
  </section>;
}
