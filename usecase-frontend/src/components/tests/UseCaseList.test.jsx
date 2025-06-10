import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UseCaseList from "../UseCaseList";
import { BrowserRouter } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

jest.mock("../UseCaseHistoryModal", () => () => (
  <div data-testid="mock-history-modal">Histórico Modal</div>
));

const renderComponent = (role, props = {}) => {
  localStorage.setItem("token", "fake-token");
  jwtDecode.mockReturnValue({ role });

  return render(
    <BrowserRouter>
      <UseCaseList {...props} />
    </BrowserRouter>
  );
};

const mockUseCases = [
  {
    id: 1,
    title: "Caso de Uso 1",
    description: "Descrição do caso de uso",
  },
];

describe("UseCaseList", () => {
  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("exibe mensagem quando a lista está vazia", () => {
    renderComponent("user", {
      useCases: [],
      onEdit: jest.fn(),
      onDelete: jest.fn(),
    });

    expect(
      screen.getByText("Nenhum caso de uso encontrado.")
    ).toBeInTheDocument();
  });

  test("renderiza título e descrição dos casos", () => {
    renderComponent("viewer", {
      useCases: mockUseCases,
      onEdit: jest.fn(),
      onDelete: jest.fn(),
    });

    expect(screen.getByText("Caso de Uso 1")).toBeInTheDocument();
    expect(screen.getByText("Descrição do caso de uso")).toBeInTheDocument();
  });

  test("mostra botões de editar e excluir para editor", () => {
    const handleEdit = jest.fn();
    renderComponent("editor", {
      useCases: mockUseCases,
      onEdit: handleEdit,
      onDelete: jest.fn(),
    });

    const editBtn = screen.getByLabelText("Editar caso de uso Caso de Uso 1");
    fireEvent.click(editBtn);
    expect(handleEdit).toHaveBeenCalledWith(mockUseCases[0]);

    expect(
      screen.getByLabelText("Excluir caso de uso Caso de Uso 1")
    ).toBeInTheDocument();
  });

  test("confirma antes de excluir caso", () => {
    const handleDelete = jest.fn();
    window.confirm = jest.fn(() => true);

    renderComponent("admin", {
      useCases: mockUseCases,
      onEdit: jest.fn(),
      onDelete: handleDelete,
    });

    const deleteBtn = screen.getByLabelText(
      "Excluir caso de uso Caso de Uso 1"
    );
    fireEvent.click(deleteBtn);

    expect(window.confirm).toHaveBeenCalled();
    expect(handleDelete).toHaveBeenCalledWith(1);
  });

  test("exibe botão de histórico apenas para admin", () => {
    renderComponent("admin", {
      useCases: mockUseCases,
      onEdit: jest.fn(),
      onDelete: jest.fn(),
    });

    expect(
      screen.getByLabelText("Ver histórico do caso de uso Caso de Uso 1")
    ).toBeInTheDocument();
  });

  test("renderiza modal de histórico ao clicar em Histórico", () => {
    renderComponent("admin", {
      useCases: mockUseCases,
      onEdit: jest.fn(),
      onDelete: jest.fn(),
    });

    const historyBtn = screen.getByLabelText(
      "Ver histórico do caso de uso Caso de Uso 1"
    );
    fireEvent.click(historyBtn);

    expect(screen.getByTestId("mock-history-modal")).toBeInTheDocument();
  });

  test("exibe erro no console com token inválido", () => {
    localStorage.setItem("token", "invalid-token");
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    jwtDecode.mockImplementation(() => {
      throw new Error("Token inválido");
    });

    render(
      <BrowserRouter>
        <UseCaseList
          useCases={mockUseCases}
          onEdit={jest.fn()}
          onDelete={jest.fn()}
        />
      </BrowserRouter>
    );

    expect(consoleSpy).toHaveBeenCalledWith(
      "Token inválido:",
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});
