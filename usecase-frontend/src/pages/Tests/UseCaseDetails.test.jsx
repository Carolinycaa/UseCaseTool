import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UseCaseDetails from "../UseCaseDetails";
import { MemoryRouter } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ IMPORTAÇÃO NOMEADA

// ✅ Mockando a função nomeada
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: "123" }),
    Link: ({ to, children }) => <a href={to}>{children}</a>,
  };
});

describe("UseCaseDetails", () => {
  const mockUseCase = {
    id: "123",
    title: "Cadastro de Usuário",
    description: "Permite cadastrar novos usuários.",
    actor: "Administrador",
    preconditions: "Estar logado",
    postconditions: "Usuário cadastrado com sucesso",
    main_flow: "Preencher formulário e enviar",
    alternative_flows: "Voltar para edição",
    exceptions: "Erro de conexão",
    created_by: 1,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "fake-token");

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockUseCase,
    });

    jwtDecode.mockReturnValue({ role: "admin", id: 1 }); // ✅ Funciona agora
  });

  it("renderiza os detalhes do caso de uso corretamente", async () => {
    render(
      <MemoryRouter>
        <UseCaseDetails />
      </MemoryRouter>
    );

    expect(screen.getByText(/carregando detalhes/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Cadastro de Usuário")).toBeInTheDocument();
    });

    expect(screen.getByText(/administrador/i)).toBeInTheDocument();
    expect(screen.getByText(/editar caso de uso/i)).toBeInTheDocument();
  });

  it("navega para a tela de edição ao clicar em editar", async () => {
    render(
      <MemoryRouter>
        <UseCaseDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/editar caso de uso/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/editar caso de uso/i));
    expect(mockNavigate).toHaveBeenCalledWith("/use-cases/edit/123");
  });

  it("exibe mensagem de erro em caso de falha na requisição", async () => {
    global.fetch.mockResolvedValueOnce({ ok: false });

    render(
      <MemoryRouter>
        <UseCaseDetails />
      </MemoryRouter>
    );

    expect(await screen.findByText(/erro:/i)).toBeInTheDocument();
  });

  it("não exibe botão de editar se não tiver permissão", async () => {
    jwtDecode.mockReturnValue({ role: "visualizador", id: 99 });

    render(
      <MemoryRouter>
        <UseCaseDetails />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByText(/editar caso de uso/i)).not.toBeInTheDocument();
    });
  });
});
