import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AccessibilityState {
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  largeText: boolean;
  setLargeText: (v: boolean) => void;
  dyslexiaFont: boolean;
  setDyslexiaFont: (v: boolean) => void;
  stopAnimations: boolean;
  setStopAnimations: (v: boolean) => void;
  highlightLinks: boolean;
  setHighlightLinks: (v: boolean) => void;
  persistentAlerts: boolean;
  setPersistentAlerts: (v: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityState | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [stopAnimations, setStopAnimations] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);
  const [persistentAlerts, setPersistentAlerts] = useState(false);

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
  }, [highContrast, largeText, dyslexiaFont, stopAnimations, highlightLinks]);

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        setHighContrast,
        largeText,
        setLargeText,
        dyslexiaFont,
        setDyslexiaFont,
        stopAnimations,
        setStopAnimations,
        highlightLinks,
        setHighlightLinks,
        persistentAlerts,
        setPersistentAlerts,
      }}
    >
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
      `}</style>
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) throw new Error("useAccessibility must be used within AccessibilityProvider");
  return context;
}
