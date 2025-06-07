import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import UseCaseDetails from "../UseCaseDetails";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mocks
jest.mock("jwt-decode", () => ({
  jwtDecode: () => ({ role: "admin", id: 1 }),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "123" }),
    useNavigate: () => jest.fn(),
  };
});

// Simula token no localStorage
beforeEach(() => {
  localStorage.setItem("token", "fake-token");
});

afterEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

describe("UseCaseDetails", () => {
  test("mostra mensagem de carregando", () => {
    jest.spyOn(global, "fetch").mockImplementation(() => new Promise(() => {}));

    render(
      <MemoryRouter initialEntries={["/use-cases/123"]}>
        <Routes>
          <Route path="/use-cases/:id" element={<UseCaseDetails />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/carregando detalhes/i)).toBeInTheDocument();
  });

  test("mostra mensagem de erro em caso de falha na requisição", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("Erro ao buscar"));

    render(
      <MemoryRouter initialEntries={["/use-cases/123"]}>
        <Routes>
          <Route path="/use-cases/:id" element={<UseCaseDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/erro: erro ao buscar/i)).toBeInTheDocument();
    });
  });

  test("renderiza os detalhes corretamente", async () => {
    const fakeData = {
      id: 123,
      title: "Cadastrar Produto",
      description: "Descrição do caso",
      actor: "Usuário",
      preconditions: "Estar logado",
      postconditions: "Produto cadastrado",
      main_flow: "1. Acessar tela\n2. Preencher dados",
      alternative_flows: "Fluxo B",
      exceptions: "Erro de validação",
      created_by: 1,
    };

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => fakeData,
    });

    render(
      <MemoryRouter initialEntries={["/use-cases/123"]}>
        <Routes>
          <Route path="/use-cases/:id" element={<UseCaseDetails />} />
        </Routes>
      </MemoryRouter>
    );

    // Espera até o título do caso de uso aparecer
    expect(await screen.findByText("Cadastrar Produto")).toBeInTheDocument();
    expect(screen.getByText(/usuário/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /editar caso de uso/i })
    ).toBeInTheDocument();
  });
});
