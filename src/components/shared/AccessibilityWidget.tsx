import React, { useState, useEffect, useRef } from "react";

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [isOpen]);

  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [stopAnimations, setStopAnimations] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [colorBlind, setColorBlind] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    if (highContrast) html.classList.add("a11y-high-contrast");
    else html.classList.remove("a11y-high-contrast");

    if (largeText) html.classList.add("a11y-large-text");
    else html.classList.remove("a11y-large-text");

    if (dyslexiaFont) html.classList.add("a11y-dyslexia");
    else html.classList.remove("a11y-dyslexia");

    if (stopAnimations) html.classList.add("a11y-no-animations");
    else html.classList.remove("a11y-no-animations");

    if (highlightLinks) html.classList.add("a11y-highlight-links");
    else html.classList.remove("a11y-highlight-links");

    if (colorBlind) html.classList.add("a11y-colorblind");
    else html.classList.remove("a11y-colorblind");
  }, [highContrast, largeText, dyslexiaFont, stopAnimations, highlightLinks, colorBlind]);

  useEffect(() => {
    let handleMouseUp = () => {};
    
    // Función auxiliar para forzar la carga de voces (en algunos navegadores es necesario llamarlo antes)
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
    }

    if (textToSpeech) {
      handleMouseUp = () => {
        // Un pequeño retraso para asegurar que el texto se haya seleccionado en el DOM
        setTimeout(() => {
          const text = window.getSelection()?.toString();
          if (text && text.trim().length > 0) {
            if ("speechSynthesis" in window) {
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(text);
              // 'es-ES' y 'es-MX' son mucho más compatibles en todos los navegadores que 'es-CR'
              utterance.lang = 'es-ES';
              utterance.rate = 0.9; // un poco más lento para mejor comprensión
              
              // Intentar buscar una voz en español por si el navegador necesita ayuda
              const voices = window.speechSynthesis.getVoices();
              const spanishVoice = voices.find(v => v.lang.startsWith('es'));
              if (spanishVoice) {
                utterance.voice = spanishVoice;
              }

              window.speechSynthesis.speak(utterance);
            }
          }
        }, 100);
      };
      document.addEventListener('mouseup', handleMouseUp);
      // También agregamos soporte para pantallas táctiles
      document.addEventListener('touchend', handleMouseUp);
    } else {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    }
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [textToSpeech]);

  const toggleWidget = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Estilos globales inyectados para accesibilidad */}
      <style>{`
        .a11y-high-contrast {
          filter: contrast(120%) saturate(150%) !important;
        }
        .a11y-high-contrast body, .a11y-high-contrast main, .a11y-high-contrast div {
          background-color: #121212 !important;
          color: #ffffff !important;
          border-color: #ffffff !important;
        }
        .a11y-high-contrast p, .a11y-high-contrast span, .a11y-high-contrast h1, .a11y-high-contrast h2, .a11y-high-contrast h3 {
          color: #ffffff !important;
        }
        .a11y-large-text {
          font-size: 115% !important;
        }
        .a11y-dyslexia * {
          font-family: 'Comic Sans MS', 'OpenDyslexic', sans-serif !important;
          letter-spacing: 0.1em !important;
          word-spacing: 0.2em !important;
          line-height: 1.6 !important;
        }
        .a11y-no-animations * {
          animation: none !important;
          transition: none !important;
          scroll-behavior: auto !important;
        }
        .a11y-highlight-links a, .a11y-highlight-links button {
          text-decoration: underline !important;
          text-decoration-thickness: 3px !important;
          text-decoration-color: #ffeb3b !important;
          outline: 3px solid #ffeb3b !important;
          outline-offset: 2px !important;
        }
        .a11y-colorblind {
          filter: grayscale(100%) sepia(10%) contrast(110%) !important;
        }
      `}</style>

      {/* Botón flotante */}
      <button
        ref={triggerRef}
        onClick={toggleWidget}
        aria-label="Abrir menú de accesibilidad"
        aria-expanded={isOpen}
        aria-controls="a11y-panel"
        className="fixed bottom-6 left-6 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/50"
      >
        <span className="material-symbols-outlined text-[30px]">
          accessibility_new
        </span>
      </button>

      {/* Menú de Opciones */}
      {isOpen && (
        <div
          id="a11y-panel"
          role="dialog"
          aria-labelledby="a11y-title"
          className="fixed bottom-24 left-6 z-[9999] w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-surface-container-lowest p-5 shadow-2xl ring-1 ring-black/5 animate-in slide-in-from-bottom-5"
        >
          <div className="mb-4 flex items-center justify-between border-b pb-3">
            <h2 id="a11y-title" className="text-lg font-bold text-on-surface">
              Accesibilidad
            </h2>
            <button
              ref={closeRef}
              onClick={() => { setIsOpen(false); triggerRef.current?.focus(); }}
              aria-label="Cerrar menú de accesibilidad"
              className="rounded-full p-1 hover:bg-surface-container-high text-on-surface"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="flex flex-col gap-4 max-h-[60vh] overflow-y-auto pr-2">
            
            {/* Discapacidad Visual */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-primary">Ajustes Visuales</h3>
              
              <label className="flex items-center justify-between text-body-md text-on-surface cursor-pointer p-2 hover:bg-surface-container rounded-lg">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">contrast</span>
                  Alto Contraste
                </span>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-primary"
                  checked={highContrast}
                  onChange={(e) => setHighContrast(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between text-body-md text-on-surface cursor-pointer p-2 hover:bg-surface-container rounded-lg">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">text_increase</span>
                  Texto más grande
                </span>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-primary"
                  checked={largeText}
                  onChange={(e) => setLargeText(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between text-body-md text-on-surface cursor-pointer p-2 hover:bg-surface-container rounded-lg">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">highlight</span>
                  Resaltar Enlaces
                </span>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-primary"
                  checked={highlightLinks}
                  onChange={(e) => setHighlightLinks(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between text-body-md text-on-surface cursor-pointer p-2 hover:bg-surface-container rounded-lg">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">palette</span>
                  Filtro Daltonismo
                </span>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-primary"
                  checked={colorBlind}
                  onChange={(e) => setColorBlind(e.target.checked)}
                />
              </label>
            </div>

            {/* Cognitivo / Dislexia */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-primary">Cognitivo / Aprendizaje</h3>
              
              <label className="flex items-center justify-between text-body-md text-on-surface cursor-pointer p-2 hover:bg-surface-container rounded-lg">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">sort_by_alpha</span>
                  Fuente Dislexia
                </span>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-primary"
                  checked={dyslexiaFont}
                  onChange={(e) => setDyslexiaFont(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between text-body-md text-on-surface cursor-pointer p-2 hover:bg-surface-container rounded-lg">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">motion_photos_off</span>
                  Detener Animaciones
                </span>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-primary"
                  checked={stopAnimations}
                  onChange={(e) => setStopAnimations(e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between text-body-md text-on-surface cursor-pointer p-2 hover:bg-surface-container rounded-lg">
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
                  Lector de texto (Selección)
                </span>
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-primary"
                  checked={textToSpeech}
                  onChange={(e) => setTextToSpeech(e.target.checked)}
                />
              </label>
            </div>

            <p className="text-xs text-on-surface-variant px-2">
              El chatbot acepta consultas escritas y muestra sus respuestas como texto.
            </p>

          </div>
          <div className="mt-4 border-t pt-3 text-center">
            <button
              onClick={() => {
                setHighContrast(false);
                setLargeText(false);
                setDyslexiaFont(false);
                setStopAnimations(false);
                setHighlightLinks(false);
                setColorBlind(false);
                setTextToSpeech(false);
              }}
              className="text-sm font-medium text-destructive hover:underline focus:outline-none"
            >
              Restablecer ajustes
            </button>
          </div>
        </div>
      )}
    </>
  );
}
