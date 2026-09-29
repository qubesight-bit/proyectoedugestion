import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CrudDialog } from "@/components/app/CrudDialog";

describe("diálogo CRUD accesible", () => {
  it("enfoca el formulario, contiene Tab, permite Escape y devuelve el foco", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <>
        <button>Agregar</button>
        <CrudDialog title="Nuevo curso" onClose={onClose}>
          <label htmlFor="nombre">Nombre</label>
          <input id="nombre" />
          <button>Guardar</button>
        </CrudDialog>
      </>,
    );
    expect(screen.getByRole("dialog", { name: "Nuevo curso" })).toHaveAttribute(
      "aria-modal",
      "true",
    );
    expect(screen.getByLabelText("Nombre")).toHaveFocus();
    screen.getByRole("button", { name: "Cerrar" }).focus();
    await user.tab({ shift: true });
    expect(screen.getByRole("button", { name: "Guardar" })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Cerrar" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledOnce();
  });
});
