import { ReactNode } from "react";
import { Button } from "@/components/ui/button";

/**
 * Renders a Material Symbol icon
 */
export function Icon({ name, className = "text-[24px]" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined font-light ${className}`}>{name}</span>;
}

/**
 * Toast notification component
 */
export function Toast({ message }: { message: string }) {
  return (
    <div className="fixed left-1/2 top-20 z-[90] flex -translate-x-1/2 items-center gap-2 rounded-full bg-inverse-surface px-4 py-3 text-inverse-on-surface shadow-lg animate-edu-rise">
      <Icon name="check_circle" className="text-[20px] text-tertiary-fixed" />
      <span className="text-label-md font-semibold">{message}</span>
    </div>
  );
}

/**
 * A simple stat card for the dashboard
 */
export function MetricCard({ icon, label, value, helper }: { icon: string; label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-on-primary-fixed">
          <Icon name={icon} className="text-[22px]" />
        </div>
        <Icon name="trending_up" className="text-[18px] text-tertiary" />
      </div>
      <p className="mt-3 text-body-sm text-on-surface-variant">{label}</p>
      <p className="text-metric-number font-bold">{value}</p>
      <p className="text-body-sm text-on-surface-variant">{helper}</p>
    </div>
  );
}

/**
 * A smaller stat card
 */
export function SmallStat({ icon, label, value, helper }: { icon: string; label: string; value: string; helper: string }) {
  return (
    <div className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-center gap-2 text-primary">
        <Icon name={icon} className="text-[22px]" />
        <span className="text-body-sm text-on-surface-variant">{label}</span>
      </div>
      <div className="mt-2 flex items-end gap-2">
        <span className="text-metric-number font-bold">{value}</span>
        {helper && <span className="pb-1 text-label-sm font-semibold text-tertiary">{helper}</span>}
      </div>
    </div>
  );
}

/**
 * Quick action button for dashboard
 */
export function QuickAction({ icon, label, onClick }: { icon: string; label: string; onClick: () => void }) {
  return (
    <Button variant="secondary" className="h-20 flex-col rounded-2xl px-2 text-center" onClick={onClick}>
      <Icon name={icon} className="text-[24px] text-primary" />
      <span className="text-label-sm font-semibold">{label}</span>
    </Button>
  );
}

/**
 * Reusable form field wrapper
 */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-label-md font-semibold">
      {label}
      {children}
    </label>
  );
}

/**
 * Shell component for modals
 */
export function ModalShell({
  title,
  subtitle,
  icon,
  children,
  onClose,
}: {
  title: string;
  subtitle?: string;
  icon: string;
  children: ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-inverse-surface/60 px-3 pb-3 pt-12 backdrop-blur-sm">
      <div className="max-h-full w-full max-w-md md:max-w-2xl tv:max-w-4xl overflow-y-auto rounded-t-3xl md:rounded-3xl bg-surface-container-lowest p-5 shadow-lg animate-edu-rise">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-fixed text-on-primary-fixed"><Icon name={icon} className="text-[22px]" /></div>
            <div><h2 className="text-headline-sm font-semibold">{title}</h2>{subtitle && <p className="text-body-sm text-on-surface-variant">{subtitle}</p>}</div>
          </div>
          <Button aria-label="Cerrar ventana" variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={onClose}><Icon name="close" className="text-[20px]" /></Button>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * Announcement card
 */
export function Announcement({
  image,
  icon,
  label,
  date,
  title,
  text,
  owner,
  action,
}: {
  image: string;
  icon: string;
  label: string;
  date: string;
  title: string;
  text: string;
  owner: string;
  action: string;
}) {
  return (
    <article className="rounded-2xl bg-surface-container-lowest p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <img alt="" className="h-5 w-5 rounded-full object-cover" src={image} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-label-sm font-semibold text-primary">
            <Icon name={icon} className="text-[17px]" />
            <span>{label}</span>
            <span className="ml-auto flex items-center gap-1 text-on-surface-variant">
              <Icon name="schedule" className="text-[16px]" />
              {date}
            </span>
          </div>
          <h3 className="mt-2 text-headline-sm font-semibold">{title}</h3>
          <p className="mt-1 text-body-sm text-on-surface-variant">{text}</p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-body-sm text-on-surface-variant">{owner}</span>
            <Button variant="ghost" className="h-8 rounded-lg px-2 text-primary">
              {action}
              <Icon name="arrow_forward" className="text-[18px]" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

/**
 * Generic simple panel layout
 */
export function SimplePanel({ icon, title }: { icon: string; title: string }) {
  return (
    <section className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center gap-3 px-8 text-center animate-edu-rise">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-fixed text-on-primary-fixed"><Icon name={icon} className="text-[34px]" /></div>
      <h1 className="text-headline-md font-semibold">{title}</h1>
      <p className="text-body-md text-on-surface-variant">Módulo institucional conectado al panel principal.</p>
    </section>
  );
}
