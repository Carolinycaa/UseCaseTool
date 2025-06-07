import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminUseCases from "../AdminUseCases";

// Mock para jwtDecode
jest.mock("jwt-decode", () => ({
  jwtDecode: () => ({ role: "admin", id: 1 }),
}));

// Mock da API
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
);

describe("AdminUseCases", () => {
  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renderiza título e botão de novo caso", async () => {
    render(
      <MemoryRouter>
        <AdminUseCases />
      </MemoryRouter>
    );

    expect(screen.getByText(/gerenciar casos de uso/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("+ Novo Caso de Uso")).toBeInTheDocument()
    );
  });

  test("exibe mensagem de nenhum caso encontrado", async () => {
    render(
      <MemoryRouter>
        <AdminUseCases />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(
        screen.getByText(/nenhum caso de uso encontrado/i)
      ).toBeInTheDocument()
    );
  });
});
