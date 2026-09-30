import { Button } from "@/components/ui/button";

export const APP_PAGE_SIZE = 6;

export function pageItems<T>(items: T[], page: number, pageSize = APP_PAGE_SIZE) {
  return items.slice((page - 1) * pageSize, page * pageSize);
}

export function PaginationControls({
  page,
  total,
  onPageChange,
  pageSize = APP_PAGE_SIZE,
}: {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (total <= pageSize) return null;
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-surface-container-lowest p-3" aria-label="Paginación">
      <p className="text-sm text-on-surface-variant">
        Mostrando {first}–{last} de {total}
      </p>
      <div className="flex items-center gap-2">
        <Button type="button" size="sm" variant="outline" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Anterior
        </Button>
        <span className="min-w-20 text-center text-sm" aria-live="polite">Página {page} de {pages}</span>
        <Button type="button" size="sm" variant="outline" disabled={page >= pages} onClick={() => onPageChange(page + 1)}>
          Siguiente
        </Button>
      </div>
    </nav>
  );
}
