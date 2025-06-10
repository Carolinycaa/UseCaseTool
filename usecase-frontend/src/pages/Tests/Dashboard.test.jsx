// __tests__/Dashboard.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import Dashboard from "../Dashboard";
import { MemoryRouter } from "react-router-dom";
import * as jwt from "jwt-decode";

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

describe("Dashboard", () => {
  const mockToken = JSON.stringify("fake-token");

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("exibe nome de usuário e função do token", () => {
    localStorage.setItem("token", mockToken);
    jwt.jwtDecode.mockReturnValue({ username: "Maria", role: "editor" });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/bem-vindo, maria/i)).toBeInTheDocument();
    expect(screen.getByText(/sua função no sistema é:/i)).toBeInTheDocument();
    expect(screen.getByText("editor")).toBeInTheDocument();
  });

  test("mostra botão para admin acessar painel administrativo", () => {
    localStorage.setItem("token", mockToken);
    jwt.jwtDecode.mockReturnValue({ username: "João", role: "admin" });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/acessar painel administrativo/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /acessar painel administrativo/i })
    ).toHaveAttribute("href", "/admin");
  });

  test("usa fallback quando token é inválido", () => {
    localStorage.setItem("token", mockToken);
    jwt.jwtDecode.mockImplementation(() => {
      throw new Error("invalid token");
    });

    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/bem-vindo, usuário/i)).toBeInTheDocument();
    expect(screen.getByText(/desconhecido/i)).toBeInTheDocument();
  });
});
