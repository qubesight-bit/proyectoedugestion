import React from "react";
import { useAccessibility } from "@/components/shared/AccessibilityContext";
import { Icon } from "@/components/shared";

export function SettingsView() {
  const {
    highContrast, setHighContrast,
    largeText, setLargeText,
    dyslexiaFont, setDyslexiaFont,
    stopAnimations, setStopAnimations,
    highlightLinks, setHighlightLinks,
    persistentAlerts, setPersistentAlerts
  } = useAccessibility();

  return (
    <div className="flex flex-col gap-6 animate-edu-rise">
      <div className="flex flex-col gap-2">
        <h1 className="text-display-sm font-bold text-on-surface">Configuraciones de la Plataforma</h1>
        <p className="text-body-lg text-on-surface-variant">
          Personaliza tu experiencia y ajusta las opciones de accesibilidad.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Accesibilidad Visual */}
        <section className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <Icon name="visibility" className="text-[28px] text-primary" />
            <h2 className="text-title-lg font-bold text-on-surface">Ajustes Visuales</h2>
          </div>
          
          <div className="flex flex-col gap-4 pt-2">
            <label className="flex items-center justify-between text-body-lg cursor-pointer">
              <span className="flex items-center gap-3">
                <Icon name="contrast" className="text-[24px]" />
                Modo de Alto Contraste
              </span>
              <input
                type="checkbox"
                className="h-6 w-6 accent-primary"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
              />
            </label>

            <label className="flex items-center justify-between text-body-lg cursor-pointer">
              <span className="flex items-center gap-3">
                <Icon name="text_increase" className="text-[24px]" />
                Texto más grande
              </span>
              <input
                type="checkbox"
                className="h-6 w-6 accent-primary"
                checked={largeText}
                onChange={(e) => setLargeText(e.target.checked)}
              />
            </label>

            <label className="flex items-center justify-between text-body-lg cursor-pointer">
              <span className="flex items-center gap-3">
                <Icon name="highlight" className="text-[24px]" />
                Resaltar enlaces interactivos
              </span>
              <input
                type="checkbox"
                className="h-6 w-6 accent-primary"
                checked={highlightLinks}
                onChange={(e) => setHighlightLinks(e.target.checked)}
              />
            </label>
          </div>
        </section>

        {/* Cognitivo / Aprendizaje */}
        <section className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-6 shadow-sm">
          <div className="flex items-center gap-3 border-b pb-4">
            <Icon name="psychology" className="text-[28px] text-primary" />
            <h2 className="text-title-lg font-bold text-on-surface">Cognitivo y Aprendizaje</h2>
          </div>
          
          <div className="flex flex-col gap-4 pt-2">
            <label className="flex items-center justify-between text-body-lg cursor-pointer">
              <span className="flex items-center gap-3">
                <Icon name="sort_by_alpha" className="text-[24px]" />
                Fuente para Dislexia
              </span>
              <input
                type="checkbox"
                className="h-6 w-6 accent-primary"
                checked={dyslexiaFont}
                onChange={(e) => setDyslexiaFont(e.target.checked)}
              />
            </label>

            <label className="flex items-center justify-between text-body-lg cursor-pointer">
              <span className="flex items-center gap-3">
                <Icon name="motion_photos_off" className="text-[24px]" />
                Detener animaciones
              </span>
              <input
                type="checkbox"
                className="h-6 w-6 accent-primary"
                checked={stopAnimations}
                onChange={(e) => setStopAnimations(e.target.checked)}
              />
            </label>
          </div>
        </section>

        {/* Auditivo y Habla */}
        <section className="flex flex-col gap-4 rounded-2xl bg-surface-container-lowest p-6 shadow-sm md:col-span-2">
          <div className="flex items-center gap-3 border-b pb-4">
            <Icon name="hearing" className="text-[28px] text-primary" />
            <h2 className="text-title-lg font-bold text-on-surface">Auditiva y Habla</h2>
          </div>
          
          <p className="text-body-md text-on-surface-variant">
            La plataforma no requiere el uso de micrófono ni comandos de voz. Todas las interacciones están diseñadas para ser 100% visuales y operables mediante teclado o ratón.
          </p>
          
          <div className="flex flex-col gap-4 pt-2">
            <label className="flex items-center justify-between text-body-lg cursor-pointer">
              <span className="flex items-center gap-3">
                <Icon name="notifications_active" className="text-[24px]" />
                Mantener notificaciones fijas en pantalla
              </span>
              <input
                type="checkbox"
                className="h-6 w-6 accent-primary"
                checked={persistentAlerts}
                onChange={(e) => setPersistentAlerts(e.target.checked)}
              />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
