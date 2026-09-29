import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccessibilityWidget } from "@/components/shared/AccessibilityWidget";

describe("menú de accesibilidad", () => {
  it("abre por teclado, enfoca el cierre y vuelve al botón con Escape", async () => {
    const user = userEvent.setup();
    render(<AccessibilityWidget />);
    const open = screen.getByRole("button", { name: "Abrir menú de accesibilidad" });
    await user.click(open);
    expect(screen.getByRole("dialog", { name: "Accesibilidad" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cerrar menú de accesibilidad" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(open).toHaveFocus();
  });
});
