import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import EditUseCasePage from "../EditUseCasePage";
import { MemoryRouter, Route, Routes } from "react-router-dom";

// Mock para useParams e useNavigate
jest.mock("react-router-dom", () => {
  const original = jest.requireActual("react-router-dom");
  return {
    ...original,
    useParams: () => ({ id: "123" }),
    useNavigate: () => jest.fn(),
  };
});

// ✅ Mock do UseCaseForm invocando corretamente os handlers
jest.mock(
  "../../components/UseCaseForm",
  () =>
    ({ useCase, onSave, onCancel }) =>
      (
        <div data-testid="usecase-form">
          <button onClick={() => onSave({ title: "Atualizado" })}>
            Salvar
          </button>
          <button onClick={onCancel}>Cancelar</button>
          <p>{useCase?.title}</p>
        </div>
      )
);

describe("EditUseCasePage", () => {
  const mockUseCase = {
    id: "123",
    title: "Título de Teste",
    description: "Descrição de teste",
  };

  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
    global.fetch = jest.fn();
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("exibe loading e carrega dados corretamente", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUseCase,
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

    expect(screen.getByText(/carregando caso de uso/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Título de Teste")).toBeInTheDocument();
    });
  });

  test("exibe erro quando falha ao carregar", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(
      <MemoryRouter>
        <EditUseCasePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/erro:/i)).toBeInTheDocument();
    });
  });

  test("chama onSave ao salvar", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUseCase,
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    render(
      <MemoryRouter>
        <EditUseCasePage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByTestId("usecase-form")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/salvar/i));

    await waitFor(() => {
      const call = fetch.mock.calls[1]; // segunda chamada: PUT
      expect(call[0]).toContain("/use-cases/123");
      expect(call[1]).toMatchObject({
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer fake-token",
        },
        body: JSON.stringify({ title: "Atualizado" }),
      });
    });
  });
});
