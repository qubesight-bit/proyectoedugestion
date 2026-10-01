import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { pageItems, PaginationControls } from "./PaginationControls";

type Document = Database["public"]["Tables"]["student_documents"]["Row"];
type StudentSummary = Pick<Database["public"]["Tables"]["students"]["Row"], "id" | "name" | "grade" | "status" | "archived_at">;
type DocumentWithStudent = Document & { students: StudentSummary | null };

function sizeLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function StudentRecordsManager() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("todas");
  const [page, setPage] = useState(1);
  const documents = useQuery({
    queryKey: ["student_documents", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_documents")
        .select("*, students(id,name,grade,status,archived_at)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as DocumentWithStudent[];
    },
  });

  const categories = useMemo(() => [...new Set((documents.data ?? []).map((document) => document.category))].sort(), [documents.data]);
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("es");
    return (documents.data ?? []).filter((document) => {
      const matchesCategory = category === "todas" || document.category === category;
      const haystack = `${document.file_name} ${document.students?.name ?? ""} ${document.students?.grade ?? ""} ${document.notes}`.toLocaleLowerCase("es");
      return matchesCategory && (!term || haystack.includes(term));
    });
  }, [category, documents.data, search]);

  useEffect(() => setPage(1), [category, search]);
  const visible = pageItems(filtered, page);

  async function openDocument(document: Document) {
    const { data, error } = await supabase.storage.from("student-records").createSignedUrl(document.storage_path, 60);
    if (error) {
      toast.error(`No se pudo abrir el documento: ${error.message}`);
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  return <section aria-labelledby="records-title" className="space-y-5">
    <div>
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">Archivo académico</p>
      <h1 id="records-title" className="text-headline-md font-semibold">Expedientes</h1>
      <p className="text-on-surface-variant">Consulte de forma segura los documentos subidos a los expedientes estudiantiles.</p>
    </div>

    <div className="grid gap-3 rounded-2xl bg-surface-container-low p-4 sm:grid-cols-[1fr_15rem]">
      <label className="grid gap-1 text-sm font-medium" htmlFor="record-search">Buscar expediente
        <input id="record-search" type="search" className="form-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Estudiante, archivo, nivel o nota" />
      </label>
      <label className="grid gap-1 text-sm font-medium" htmlFor="record-category">Categoría
        <select id="record-category" className="form-input" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="todas">Todas las categorías</option>
          {categories.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
    </div>

    {documents.isLoading && <p role="status">Cargando expedientes…</p>}
    {documents.error && <p role="alert" className="text-destructive">No se pudieron cargar los expedientes: {(documents.error as Error).message}</p>}
    {!documents.isLoading && !filtered.length && <div className="rounded-2xl border border-dashed p-8 text-center"><span aria-hidden="true" className="material-symbols-outlined text-4xl text-primary">folder_off</span><p className="mt-2 font-semibold">No hay documentos que coincidan</p><p className="text-sm text-on-surface-variant">Los archivos se agregan desde la sección Estudiantes, abriendo el expediente correspondiente.</p></div>}

    <ul className="grid gap-3 md:grid-cols-2">
      {visible.map((document) => <li key={document.id} className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <span aria-hidden="true" className="material-symbols-outlined rounded-xl bg-primary/10 p-2 text-primary">description</span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold" title={document.file_name}>{document.file_name}</p>
            <p className="font-medium text-primary">{document.students?.name ?? "Estudiante no disponible"}</p>
            <p className="text-sm text-on-surface-variant">{document.category} · {sizeLabel(document.size_bytes)} · {new Date(document.created_at).toLocaleDateString("es-CR")}</p>
            <p className="text-sm text-on-surface-variant">Nivel: {document.students?.grade ?? "Sin registrar"} · Estado: {document.students?.archived_at ? "Archivado" : (document.students?.status ?? "Sin registrar")}</p>
            {document.notes && <p className="mt-2 text-sm">{document.notes}</p>}
          </div>
        </div>
        <Button type="button" variant="outline" className="mt-4 w-full gap-2" onClick={() => void openDocument(document)}><span aria-hidden="true" className="material-symbols-outlined">open_in_new</span>Abrir documento</Button>
      </li>)}
    </ul>
    <PaginationControls page={page} total={filtered.length} onPageChange={setPage} />
  </section>;
}
