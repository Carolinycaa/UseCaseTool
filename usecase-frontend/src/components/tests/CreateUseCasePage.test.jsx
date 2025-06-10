import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateUseCasePage from "../CreateUseCasePage";
import { MemoryRouter } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
  MemoryRouter: jest.requireActual("react-router-dom").MemoryRouter,
}));

jest.mock("../UseCaseForm", () => ({ onSave }) => {
  return (
    <div>
      <button onClick={() => onSave({ title: "Teste", description: "Desc" })}>
        Salvar Teste
      </button>
    </div>
  );
});

const setup = (role) => {
  localStorage.setItem("token", "fake-token");
  jwtDecode.mockReturnValue({ role });
};

describe("CreateUseCasePage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("exibe mensagem de acesso negado se o usuário não for admin/editor", () => {
    setup("viewer");

    render(
      <MemoryRouter>
        <CreateUseCasePage />
      </MemoryRouter>
    );

    expect(screen.getByText(/você não tem permissão/i)).toBeInTheDocument();
  });

  it("renderiza formulário se for admin", () => {
    setup("admin");

    render(
      <MemoryRouter>
        <CreateUseCasePage />
      </MemoryRouter>
    );

    expect(screen.getByText("Salvar Teste")).toBeInTheDocument();
  });

  it("envia dados corretamente e redireciona", async () => {
    setup("admin");

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    );

    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <CreateUseCasePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Salvar Teste"));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/use-cases"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ title: "Teste", description: "Desc" }),
        })
      );

      expect(window.alert).toHaveBeenCalledWith(
        "Caso de uso criado com sucesso!"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/admin/usecases");
    });
  });

  it("exibe erro se a requisição falhar", async () => {
    setup("admin");

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () =>
          Promise.resolve({
            error: "Erro ao criar caso de uso",
          }),
      })
    );

    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <CreateUseCasePage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText("Salvar Teste"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Erro ao criar caso de uso");
    });
  });
});
