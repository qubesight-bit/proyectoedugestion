import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getUser: vi.fn(),
  eq: vi.fn(),
}));
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: { getUser: mocks.getUser },
    from: () => ({ select: () => ({ eq: mocks.eq }) }),
  },
}));

import { requireStaffAccount } from "@/lib/access";

describe("protección de la ruta privada", () => {
  beforeEach(() => {
    mocks.getUser.mockReset();
    mocks.eq.mockReset();
  });
  it("rechaza una visita sin sesión", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: null }, error: null });
    expect(await requireStaffAccount()).toBeNull();
    expect(mocks.eq).not.toHaveBeenCalled();
  });
  it("rechaza cuentas sin rol de personal o ante fallo de consulta", async () => {
    mocks.getUser.mockResolvedValue({ data: { user: { id: "123" } }, error: null });
    mocks.eq.mockResolvedValueOnce({ data: [{ role: "estudiante" }], error: null });
    expect(await requireStaffAccount()).toBeNull();
    mocks.eq.mockResolvedValueOnce({ data: null, error: Error("Sin acceso") });
    expect(await requireStaffAccount()).toBeNull();
  });
  it.each(["admin", "docente"])("permite el rol %s", async (role) => {
    const user = { id: "123" };
    mocks.getUser.mockResolvedValue({ data: { user }, error: null });
    mocks.eq.mockResolvedValue({ data: [{ role }], error: null });
    expect(await requireStaffAccount()).toBe(user);
    expect(mocks.eq).toHaveBeenCalledWith("user_id", user.id);
  });
});
