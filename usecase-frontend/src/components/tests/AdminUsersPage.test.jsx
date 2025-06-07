import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import AdminUsersPage from "../AdminUsersPage";

// Mock do localStorage e da API
beforeEach(() => {
  localStorage.setItem("token", "fake-token");

  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => [
      {
        id: 1,
        username: "admin1",
        email: "admin1@example.com",
        role: "admin",
      },
    ],
  });
});

afterEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe("AdminUsersPage", () => {
  test("renderiza título e carrega usuários", async () => {
    render(<AdminUsersPage />);

    expect(screen.getByText("Gerenciar Usuários")).toBeInTheDocument();
    expect(screen.getByText("Carregando usuários...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("admin1")).toBeInTheDocument();
      expect(screen.getByText("admin1@example.com")).toBeInTheDocument();
      expect(screen.getByText("admin")).toBeInTheDocument();
    });
  });

  test("exibe erro ao falhar carregamento", async () => {
    fetch.mockRejectedValueOnce(new Error("Erro de rede"));

    render(<AdminUsersPage />);

    await waitFor(() => {
      expect(screen.getByText("Erro de rede")).toBeInTheDocument();
    });
  });

  test("exibe botões de mudança de papel", async () => {
    render(<AdminUsersPage />);

    await waitFor(() => {
      expect(screen.getByText("Tornar editor")).toBeInTheDocument();
      expect(screen.getByText("Tornar visualizador")).toBeInTheDocument();
    });
  });
  test("confirma mudança de papel ao clicar", async () => {
    window.confirm = jest.fn(() => true);

    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            username: "admin1",
            email: "admin1@example.com",
            role: "admin",
          },
        ],
      })
      .mockResolvedValueOnce({ ok: true, json: async () => ({}) }) // PUT
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 1,
            username: "admin1",
            email: "admin1@example.com",
            role: "editor",
          },
        ],
      });

    render(<AdminUsersPage />);

    const button = await screen.findByText("Tornar editor");
    fireEvent.click(button);

    expect(window.confirm).toHaveBeenCalled();

    const successMessage = await screen.findByTestId("success-msg");
    expect(successMessage).toHaveTextContent("Papel atualizado com sucesso");
  });
});
