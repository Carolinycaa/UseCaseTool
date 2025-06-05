import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "../Dashboard";
import { MemoryRouter } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Mock do jwtDecode
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

describe("Página de Dashboard", () => {
  const renderDashboard = () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renderiza nome e papel do usuário a partir do token", () => {
    const mockToken = "fake-token";
    const mockUser = { username: "joao", role: "user" };
    localStorage.setItem("token", mockToken);
    jwtDecode.mockReturnValue(mockUser);

    renderDashboard();

    expect(screen.getByText(/bem-vindo, joao/i)).toBeInTheDocument();
    expect(
      screen.getByText(
        (content, element) =>
          element.tagName.toLowerCase() === "p" &&
          content.includes("função no sistema é:")
      )
    ).toBeInTheDocument();

    expect(screen.getByText("desconhecido")).toBeInTheDocument();

    expect(
      screen.queryByText(/acessar painel administrativo/i)
    ).not.toBeInTheDocument();
  });

  test("mostra link do painel administrativo se for admin", () => {
    const mockToken = "fake-token";
    const mockUser = { username: "admin", role: "admin" };
    localStorage.setItem("token", mockToken);
    jwtDecode.mockReturnValue(mockUser);

    renderDashboard();

    expect(screen.getByText(/bem-vindo, admin/i)).toBeInTheDocument();
    expect(
      screen.getByText(/acessar painel administrativo/i)
    ).toBeInTheDocument();
  });

  test("mostra fallback se token for inválido", () => {
    localStorage.setItem("token", "token-invalido");
    jwtDecode.mockImplementation(() => {
      throw new Error("Token inválido");
    });

    renderDashboard();

    expect(screen.getByText(/bem-vindo, usuário/i)).toBeInTheDocument();
    expect(
      screen.getByText(/função no sistema é: desconhecido/i)
    ).toBeInTheDocument();
  });
});
