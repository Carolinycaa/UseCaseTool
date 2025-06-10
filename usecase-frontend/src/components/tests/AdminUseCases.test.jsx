// src/pages/__tests__/AdminUseCases.test.jsx
import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminUseCases from "../AdminUseCases";
import { jwtDecode } from "jwt-decode";

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  Link: ({ to, children }) => <a href={to}>{children}</a>,
}));

describe("AdminUseCases", () => {
  const mockUseCases = [
    {
      id: 1,
      title: "Login",
      description: "Autenticação de usuário",
      creator: { username: "admin" },
    },
  ];

  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
    jwtDecode.mockReturnValue({ role: "admin" });
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("mostra mensagem de carregamento", async () => {
    jest.spyOn(global, "fetch").mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter>
        <AdminUseCases />
      </MemoryRouter>
    );

    expect(screen.getByText(/carregando casos de uso/i)).toBeInTheDocument();
  });

  test("exibe erro se a requisição falhar", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({ ok: false });

    render(
      <MemoryRouter>
        <AdminUseCases />
      </MemoryRouter>
    );

    expect(await screen.findByText(/erro ao buscar/i)).toBeInTheDocument();
  });

  test("renderiza casos de uso", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockUseCases,
    });

    render(
      <MemoryRouter>
        <AdminUseCases />
      </MemoryRouter>
    );

    expect(await screen.findByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Autenticação de usuário")).toBeInTheDocument();
    expect(screen.getByText("admin")).toBeInTheDocument();
  });

  test("executa busca corretamente", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockUseCases,
    });

    render(
      <MemoryRouter>
        <AdminUseCases />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText("Login"));

    fireEvent.change(screen.getByPlaceholderText(/buscar/i), {
      target: { value: "inexistente" },
    });

    await waitFor(() => {
      expect(screen.queryByText("Login")).not.toBeInTheDocument();
      expect(
        screen.getByText((text) =>
          text.toLowerCase().includes("nenhum caso de uso encontrado")
        )
      ).toBeInTheDocument();
    });
  });

  test("aciona navegação ao editar", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockUseCases,
    });

    render(
      <MemoryRouter>
        <AdminUseCases />
      </MemoryRouter>
    );

    const editButton = await screen.findByText(/editar/i);
    fireEvent.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith("/use-cases/edit/1");
  });

  test("exclui um caso de uso após confirmação", async () => {
    window.confirm = jest.fn(() => true);

    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce({ ok: true, json: async () => mockUseCases }) // GET
      .mockResolvedValueOnce({ ok: true }); // DELETE

    render(
      <MemoryRouter>
        <AdminUseCases />
      </MemoryRouter>
    );

    const deleteButton = await screen.findByText(/excluir/i);
    fireEvent.click(deleteButton);

    await waitFor(() =>
      expect(screen.queryByText("Login")).not.toBeInTheDocument()
    );
  });

  test("abre o modal de histórico", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockUseCases,
    });

    render(
      <MemoryRouter>
        <AdminUseCases />
      </MemoryRouter>
    );

    const historyButton = await screen.findByText(/histórico/i);
    fireEvent.click(historyButton);

    expect(await screen.findByTestId("modal-backdrop")).toBeInTheDocument();
  });
});
