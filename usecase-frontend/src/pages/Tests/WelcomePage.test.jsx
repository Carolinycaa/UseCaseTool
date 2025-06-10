import React from "react";
import { render, screen } from "@testing-library/react";
import WelcomePage from "../WelcomePage";
import { MemoryRouter } from "react-router-dom";

describe("WelcomePage", () => {
  beforeEach(() => {
    // Coloca um token para verificar se é removido no useEffect
    localStorage.setItem("token", "fake-token");
  });

  it("remove o token do localStorage ao montar", () => {
    render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>
    );

    expect(localStorage.getItem("token")).toBe(null);
  });

  it("renderiza os textos principais corretamente", () => {
    render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Seja bem-vindo!")).toBeInTheDocument();
    expect(
      screen.getByText("Entre para acessar suas funcionalidades.")
    ).toBeInTheDocument();
    expect(screen.getByText("Sistema de Casos de Uso")).toBeInTheDocument();
    expect(
      screen.getByText("Por favor, faça login para continuar.")
    ).toBeInTheDocument();
  });

  it('possui um botão que leva para a rota "/login"', () => {
    render(
      <MemoryRouter>
        <WelcomePage />
      </MemoryRouter>
    );

    const loginButton = screen.getByRole("button", { name: /fazer login/i });
    expect(loginButton).toBeInTheDocument();

    const link = screen.getByRole("link", { name: /fazer login/i });
    expect(link).toHaveAttribute("href", "/login");
  });
});
