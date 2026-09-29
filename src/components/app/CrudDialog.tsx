import { useEffect, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

/** Accessible modal: focus trap on open, Escape closes, labelled by its title. */
export function CrudDialog({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    (
      ref.current?.querySelector<HTMLElement>("input,select,textarea") ??
      ref.current?.querySelector<HTMLElement>("button")
    )?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key !== "Tab" || !ref.current) return;
      const focusable = [
        ...ref.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((el) => el.getClientRects().length > 0 || el.offsetParent !== null);
      // jsdom does not compute layout, while actual browsers do.
      const items = focusable.length
        ? focusable
        : [
            ...ref.current.querySelectorAll<HTMLElement>(
              "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])",
            ),
          ];
      if (!items.length) return;
      if (e.shiftKey && document.activeElement === items[0]) {
        e.preventDefault();
        items[items.length - 1]?.focus();
      } else if (!e.shiftKey && document.activeElement === items[items.length - 1]) {
        e.preventDefault();
        items[0]?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-foreground/40 md:items-center"
      onClick={onClose}
    >
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="crud-title"
        className="max-h-[90vh] w-full overflow-y-auto rounded-t-3xl bg-surface p-5 shadow-xl md:max-w-lg md:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="crud-title" className="text-headline-sm font-semibold">
            {title}
          </h2>
          <Button variant="ghost" size="icon" aria-label="Cerrar" onClick={onClose}>
            <span aria-hidden="true" className="material-symbols-outlined">
              close
            </span>
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FormField({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-label-md font-semibold">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-body-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
