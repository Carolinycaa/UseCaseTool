import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import UseCaseHistoryModal from "../UseCaseHistoryModal";

// Mock localStorage
beforeEach(() => {
  localStorage.setItem("token", "fake-token");
});

afterEach(() => {
  localStorage.clear();
  jest.restoreAllMocks();
});

const mockHistoryData = [
  {
    id: 1,
    title: "Título 1",
    description: "Descrição 1",
    actor: "Usuário",
    preconditions: "Pré-condições",
    postconditions: "Pós-condições",
    main_flow: "Passo 1, Passo 2",
    alternative_flows: "Alternativa",
    exceptions: "Exceção",
    edited_at: new Date().toISOString(),
    editor: { username: "EditorUser" },
  },
];

describe("UseCaseHistoryModal", () => {
  test("renderiza loading inicialmente", () => {
    jest.spyOn(global, "fetch").mockImplementation(() => new Promise(() => {}));

    render(<UseCaseHistoryModal useCaseId={1} onClose={jest.fn()} />);
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  test("exibe mensagem de erro em caso de falha", async () => {
    jest
      .spyOn(global, "fetch")
      .mockRejectedValueOnce(new Error("Erro ao buscar histórico"));

    render(<UseCaseHistoryModal useCaseId={1} onClose={jest.fn()} />);
    expect(await screen.findByText(/erro/i)).toBeInTheDocument();
  });

  test("exibe mensagem quando histórico está vazio", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<UseCaseHistoryModal useCaseId={1} onClose={jest.fn()} />);
    expect(
      await screen.findByText(/nenhuma alteração registrada/i)
    ).toBeInTheDocument();
  });

  test("renderiza histórico quando há dados", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => mockHistoryData,
    });

    render(<UseCaseHistoryModal useCaseId={1} onClose={jest.fn()} />);

    const cards = await screen.findAllByRole("listitem");
    expect(cards.length).toBeGreaterThan(0);

    cards.forEach((card) => {
      expect(within(card).getByText(/Título/i)).toBeInTheDocument();
      expect(within(card).getByText(/Editado por:/i)).toBeInTheDocument();
      expect(within(card).getByText(/EditorUser/i)).toBeInTheDocument();

      const descricoes = within(card).getAllByText(
        (_, node) =>
          node.textContent.includes("Descrição:") &&
          node.textContent.includes("Descrição 1")
      );
      expect(descricoes.length).toBeGreaterThan(0);

      const excecoes = within(card).getAllByText(
        (_, node) =>
          node.textContent.includes("Exceções:") &&
          node.textContent.includes("Exceção")
      );
      expect(excecoes.length).toBeGreaterThan(0);
    });
  });

  test("fecha modal ao clicar no botão de fechar", async () => {
    const onClose = jest.fn();

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<UseCaseHistoryModal useCaseId={1} onClose={onClose} />);
    const closeButton = await screen.findByRole("button", {
      name: /fechar modal/i,
    });
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalled();
  });

  test("fecha modal ao clicar fora (backdrop)", async () => {
    const onClose = jest.fn();

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<UseCaseHistoryModal useCaseId={1} onClose={onClose} />);
    const backdrop = await screen.findByTestId("modal-backdrop");
    fireEvent.click(backdrop);
    expect(onClose).toHaveBeenCalled();
  });

  test("não fecha modal se clicar dentro da modal", async () => {
    const onClose = jest.fn();

    jest.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<UseCaseHistoryModal useCaseId={1} onClose={onClose} />);
    const modal = await screen.findByText(/histórico de alterações/i);
    fireEvent.click(modal);
    expect(onClose).not.toHaveBeenCalled();
  });
});
