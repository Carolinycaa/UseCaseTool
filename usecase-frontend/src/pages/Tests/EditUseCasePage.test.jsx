import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import EditUseCasePage from "../EditUseCasePage";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock do localStorage
beforeEach(() => {
  localStorage.setItem("token", "fake-token");
});

// Mock de useParams
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useParams: () => ({ id: "123" }),
    useNavigate: () => jest.fn(),
  };
});

// Mock de UseCaseForm
jest.mock("../../components/UseCaseForm", () => ({ useCase }) => (
  <div data-testid="usecase-form">{useCase?.title}</div>
));

describe("EditUseCasePage", () => {
  afterEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
  });

  test("exibe loading enquanto busca dados", async () => {
    jest.spyOn(global, "fetch").mockImplementation(
      () => new Promise(() => {}) // nunca resolve, simula loading
    );

    render(
      <MemoryRouter initialEntries={["/admin/usecases/edit/123"]}>
        <Routes>
          <Route
            path="/admin/usecases/edit/:id"
            element={<EditUseCasePage />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  test("exibe erro se a requisição falhar", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("Falha ao buscar"));

    render(
      <MemoryRouter initialEntries={["/admin/usecases/edit/123"]}>
        <Routes>
          <Route
            path="/admin/usecases/edit/:id"
            element={<EditUseCasePage />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/erro: falha ao buscar/i)).toBeInTheDocument();
    });
  });

  test("renderiza o formulário com os dados do caso de uso", async () => {
    const fakeData = { title: "Login UC", description: "desc" };
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => fakeData,
    });

    render(
      <MemoryRouter initialEntries={["/admin/usecases/edit/123"]}>
        <Routes>
          <Route
            path="/admin/usecases/edit/:id"
            element={<EditUseCasePage />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByTestId("usecase-form")).toHaveTextContent(
      "Login UC"
    );
  });
});
