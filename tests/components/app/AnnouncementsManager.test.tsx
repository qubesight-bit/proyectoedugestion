import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mocks = vi.hoisted(() => ({
  insert: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  eq: vi.fn(),
  getUser: vi.fn(),
  select: vi.fn(),
  order: vi.fn(),
  single: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { getUser: mocks.getUser },
    from: () => ({
      select: mocks.select,
      order: mocks.order,
      insert: mocks.insert,
      update: mocks.update,
      delete: mocks.remove,
      eq: mocks.eq,
      single: mocks.single,
    }),
  },
}));
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

import { AnnouncementsManager } from "@/components/app/AnnouncementsManager";

const announcement = {
  id: "2",
  title: "Inicio de clases",
  content: "Lunes",
  author_name: "Dirección",
  source: "app",
  created_at: "2026-09-29T00:00:00Z",
};
function renderManager(isAdmin: boolean) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <AnnouncementsManager isAdmin={isAdmin} />
    </QueryClientProvider>,
  );
}

describe("CRUD de anuncios contra Supabase", () => {
  beforeEach(() => {
    Object.values(mocks).forEach((fn) => fn.mockReset());
    mocks.getUser.mockResolvedValue({ data: { user: { id: "admin-1" } } });
    mocks.order.mockResolvedValue({ data: [announcement], error: null });
    mocks.select.mockImplementation(() => ({ order: mocks.order, single: mocks.single }));
    mocks.insert.mockImplementation(() => ({ select: mocks.select }));
    mocks.update.mockImplementation(() => ({ eq: mocks.eq }));
    mocks.remove.mockImplementation(() => ({ eq: mocks.eq }));
    mocks.eq.mockImplementation(() => ({ select: mocks.select }));
    mocks.single.mockResolvedValue({ data: { id: "2" }, error: null });
  });

  it("consulta los registros y oculta acciones a un docente", async () => {
    renderManager(false);
    expect(await screen.findByText("Inicio de clases")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Nuevo anuncio" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Eliminar anuncio/ })).not.toBeInTheDocument();
  });

  it("crea y edita mediante operaciones de Supabase", async () => {
    const user = userEvent.setup();
    renderManager(true);
    await screen.findByText("Inicio de clases");
    await user.click(screen.getByRole("button", { name: "Nuevo anuncio" }));
    await user.type(screen.getByLabelText("Título *"), "Nuevo aviso");
    await user.type(screen.getByLabelText("Contenido *"), "Reunión mañana");
    await user.click(screen.getByRole("button", { name: "Guardar" }));
    await waitFor(() =>
      expect(mocks.insert).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Nuevo aviso",
          content: "Reunión mañana",
          created_by: "admin-1",
        }),
      ),
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await user.click(screen.getByRole("button", { name: "Editar anuncio Inicio de clases" }));
    await user.clear(screen.getByLabelText("Contenido *"));
    await user.type(screen.getByLabelText("Contenido *"), "Martes");
    await user.click(screen.getByRole("button", { name: "Guardar" }));
    await waitFor(() =>
      expect(mocks.update).toHaveBeenCalledWith(expect.objectContaining({ content: "Martes" })),
    );
    expect(mocks.eq).toHaveBeenCalledWith("id", "2");
  });

  it("elimina solamente después de confirmar", async () => {
    const user = userEvent.setup();
    const confirm = vi
      .spyOn(window, "confirm")
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true);
    renderManager(true);
    await screen.findByText("Inicio de clases");
    const button = screen.getByRole("button", { name: "Eliminar anuncio Inicio de clases" });
    await user.click(button);
    expect(mocks.remove).not.toHaveBeenCalled();
    await user.click(button);
    await waitFor(() => expect(mocks.remove).toHaveBeenCalledOnce());
    confirm.mockRestore();
  });
});
