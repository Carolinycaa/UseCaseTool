import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UseCasePage from "../UseCasePage";
import { jwtDecode } from "jwt-decode";

jest.mock("jwt-decode", () => ({ jwtDecode: jest.fn() }));
jest.mock("../UseCaseForm", () => () => (
  <div data-testid="mock-form">Form</div>
));
jest.mock("../UseCaseHistoryModal", () => () => (
  <div data-testid="mock-history-modal">Histórico</div>
));

const mockUseCases = [
  {
    id: 1,
    title: "Caso de Uso 1",
    description: "Descrição do caso de uso 1",
    created_by: { id: 2 },
    creator: { username: "joao" },
  },
];

describe("UseCasePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "fake-token");
    global.fetch = jest.fn((url) => {
      if (url.includes("/usecases")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockUseCases),
        });
      }
      return Promise.reject("Unknown endpoint");
    });
  });

  test("renderiza lista de casos de uso e busca", async () => {
    jwtDecode.mockReturnValue({ role: "editor", id: 2 });

    render(
      <BrowserRouter>
        <UseCasePage />
      </BrowserRouter>
    );

    expect(screen.getByText("Carregando casos de uso...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Caso de Uso 1")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText("Buscar por título...");
    fireEvent.change(input, { target: { value: "inexistente" } });
    expect(
      screen.getByText("Nenhum caso de uso encontrado.")
    ).toBeInTheDocument();
  });

  test("exibe botão novo caso se editor", async () => {
    jwtDecode.mockReturnValue({ role: "editor", id: 2 });

    render(
      <BrowserRouter>
        <UseCasePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("+ Novo Caso de Uso")).toBeInTheDocument();
    });
  });

  test("não exibe botões se viewer", async () => {
    jwtDecode.mockReturnValue({ role: "viewer", id: 5 });

    render(
      <BrowserRouter>
        <UseCasePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText("Editar")).not.toBeInTheDocument();
      expect(screen.queryByText("Excluir")).not.toBeInTheDocument();
    });
  });

  test("abre modal de histórico ao clicar", async () => {
    jwtDecode.mockReturnValue({ role: "admin", id: 1 });

    render(
      <BrowserRouter>
        <UseCasePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.click(screen.getByText("Ver Histórico"));
    });

    expect(screen.getByTestId("mock-history-modal")).toBeInTheDocument();
  });
});
