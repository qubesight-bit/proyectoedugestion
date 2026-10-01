import { useEffect, useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { CrudDialog, FormField } from "./CrudDialog";

type Student = Database["public"]["Tables"]["students"]["Row"];
type Document = Database["public"]["Tables"]["student_documents"]["Row"];
const CATEGORIES = ["Identificación", "Académico", "Médico", "Matrícula", "Autorización", "Otro"];
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_EXTENSIONS = ["pdf", "jpg", "jpeg", "png", "webp", "doc", "docx"];

function safeFileName(name: string) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9._-]/g, "-");
}

function sizeLabel(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export function StudentDocumentsDialog({ student, isAdmin, onClose }: { student: Student; isAdmin: boolean; onClose: () => void }) {
  const qc = useQueryClient();
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => { void supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null)); }, []);
  const documents = useQuery({
    queryKey: ["student_documents", student.id],
    queryFn: async () => {
      const { data, error } = await supabase.from("student_documents").select("*").eq("student_id", student.id).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const upload = useMutation({
    mutationFn: async ({ file, category, notes }: { file: File; category: string; notes: string }) => {
      const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ALLOWED_EXTENSIONS.includes(extension)) throw new Error("Formato no permitido. Use PDF, Word o una imagen.");
      if (file.size > MAX_BYTES) throw new Error("El archivo supera el máximo de 10 MB.");
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) throw new Error("La sesión expiró. Inicie sesión nuevamente.");
      const path = `${student.id}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
      const fileOptions = file.type ? { contentType: file.type } : undefined;
      const { error: storageError } = await supabase.storage.from("student-records").upload(path, file, fileOptions);
      if (storageError) throw storageError;
      const { error: metadataError } = await supabase.from("student_documents").insert({ student_id: student.id, file_name: file.name, storage_path: path, ...(file.type ? { mime_type: file.type } : {}), size_bytes: file.size, category, notes: notes.trim(), uploaded_by: auth.user.id });
      if (metadataError) {
        await supabase.storage.from("student-records").remove([path]);
        throw metadataError;
      }
    },
    onSuccess: async () => { toast.success("Documento agregado al expediente"); await qc.invalidateQueries({ queryKey: ["student_documents", student.id] }); },
    onError: (error: Error) => toast.error(error.message),
  });

  const remove = useMutation({
    mutationFn: async (document: Document) => {
      const { error: storageError } = await supabase.storage.from("student-records").remove([document.storage_path]);
      if (storageError) throw storageError;
      const { error } = await supabase.from("student_documents").delete().eq("id", document.id);
      if (error) throw error;
    },
    onSuccess: async () => { toast.success("Documento eliminado del expediente"); await qc.invalidateQueries({ queryKey: ["student_documents", student.id] }); },
    onError: (error: Error) => toast.error(error.message),
  });

  async function download(document: Document) {
    const { data, error } = await supabase.storage.from("student-records").createSignedUrl(document.storage_path, 60);
    if (error) {
      toast.error(error.message);
      return;
    }
    window.open(data.signedUrl, "_blank", "noopener,noreferrer");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const file = values.get("document");
    if (!(file instanceof File) || !file.size) {
      toast.error("Seleccione un archivo.");
      return;
    }
    upload.mutate({ file, category: String(values.get("category")), notes: String(values.get("notes") ?? "") }, { onSuccess: () => form.reset() });
  }

  return <CrudDialog title={`Expediente de ${student.name}`} onClose={onClose}>
    <div className="flex flex-col gap-5">
      <form onSubmit={submit} className="rounded-2xl bg-surface-container-low p-4">
        <h3 className="mb-3 font-semibold">Agregar documento</h3>
        <div className="flex flex-col gap-3">
          <FormField id="record-file" label="Archivo *"><input id="record-file" name="document" type="file" required accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx" className="form-input h-auto py-2" /></FormField>
          <FormField id="record-category" label="Categoría"><select id="record-category" name="category" className="form-input">{CATEGORIES.map((category) => <option key={category}>{category}</option>)}</select></FormField>
          <FormField id="record-notes" label="Nota"><textarea id="record-notes" name="notes" maxLength={500} rows={2} className="form-input" placeholder="Descripción opcional" /></FormField>
          <p className="text-body-sm text-on-surface-variant">PDF, Word o imagen. Máximo 10 MB. Los archivos son privados.</p>
          <Button type="submit" disabled={upload.isPending}>{upload.isPending ? "Subiendo…" : "Subir al expediente"}</Button>
        </div>
      </form>
      <div>
        <h3 className="mb-3 font-semibold">Documentos guardados</h3>
        {documents.isLoading && <p role="status">Cargando expediente…</p>}
        {documents.error && <p role="alert" className="text-destructive">{(documents.error as Error).message}</p>}
        {!documents.isLoading && !documents.data?.length && <p className="text-body-sm text-on-surface-variant">Este expediente todavía no tiene documentos.</p>}
        <ul className="flex flex-col gap-2">{documents.data?.map((document) => <li key={document.id} className="rounded-xl border border-outline-variant p-3">
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="truncate font-semibold">{document.file_name}</p><p className="text-body-sm text-on-surface-variant">{document.category} · {sizeLabel(document.size_bytes)} · {new Date(document.created_at).toLocaleDateString("es-CR")}</p>{document.notes && <p className="mt-1 text-body-sm">{document.notes}</p>}</div>
            <div className="flex shrink-0 gap-1"><Button type="button" size="icon" variant="ghost" aria-label={`Abrir ${document.file_name}`} onClick={() => void download(document)}><span aria-hidden="true" className="material-symbols-outlined">download</span></Button>
              {(isAdmin || document.uploaded_by === userId) && <Button type="button" size="icon" variant="ghost" aria-label={`Eliminar ${document.file_name}`} disabled={remove.isPending} onClick={() => confirm(`¿Eliminar ${document.file_name} del expediente?`) && remove.mutate(document)}><span aria-hidden="true" className="material-symbols-outlined text-destructive">delete</span></Button>}
            </div></div>
        </li>)}</ul>
      </div>
    </div>
  </CrudDialog>;
}
