import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

describe("LoginForm", () => {
  it("muestra error accesible con correo inválido y no envía", async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("Correo institucional"), "malo");
    await userEvent.type(screen.getByLabelText("Contraseña"), "123456");
    await userEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(screen.getByRole("alert")).toHaveTextContent("correo válido");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("envía credenciales y muestra el error del servidor", async () => {
    const onSubmit = vi.fn().mockResolvedValue("Correo o contraseña incorrectos.");
    render(<LoginForm onSubmit={onSubmit} />);
    await userEvent.type(screen.getByLabelText("Correo institucional"), "a@b.com");
    await userEvent.type(screen.getByLabelText("Contraseña"), "secreta1");
    await userEvent.click(screen.getByRole("button", { name: /ingresar/i }));
    expect(onSubmit).toHaveBeenCalledWith({ email: "a@b.com", password: "secreta1", remember: true });
    expect(await screen.findByRole("alert")).toHaveTextContent("incorrectos");
  });

  it("permite mostrar la contraseña", async () => {
    render(<LoginForm onSubmit={vi.fn()} />);
    const pwd = screen.getByLabelText("Contraseña");
    expect(pwd).toHaveAttribute("type", "password");
    await userEvent.click(screen.getByRole("button", { name: "Mostrar contraseña" }));
    expect(pwd).toHaveAttribute("type", "text");
  });
});
