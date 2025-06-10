import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UseCaseForm from "../UseCaseForm";

describe("UseCaseForm", () => {
  const defaultFormData = {
    title: "Título",
    description: "Descrição",
    actor: "Ator",
    preconditions: "Pré-condições",
    postconditions: "Pós-condições",
    main_flow: "Fluxo principal",
    alternative_flows: "Fluxo alternativo",
    exceptions: "Exceções",
  };

  test("renderiza formulário vazio por padrão", () => {
    render(<UseCaseForm onSave={jest.fn()} onCancel={jest.fn()} />);

    expect(screen.getByLabelText(/título/i)).toHaveValue("");
    expect(screen.getByRole("button", { name: /salvar/i })).toBeInTheDocument();
  });

  test("preenche campos ao receber um caso de uso", () => {
    render(
      <UseCaseForm
        onSave={jest.fn()}
        onCancel={jest.fn()}
        useCase={defaultFormData}
      />
    );

    expect(screen.getByLabelText(/título/i)).toHaveValue("Título");
    expect(screen.getByLabelText(/descrição/i)).toHaveValue("Descrição");
    expect(screen.getByLabelText(/ator/i)).toHaveValue("Ator");
  });

  test("chama onCancel ao clicar no botão de cancelar", () => {
    const onCancel = jest.fn();
    render(<UseCaseForm onSave={jest.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole("button", { name: /cancelar/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  test("exibe erro se campos obrigatórios estiverem vazios", async () => {
    render(<UseCaseForm onSave={jest.fn()} onCancel={jest.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(
      await screen.findByText(/preencha todos os campos obrigatórios/i)
    ).toBeInTheDocument();
  });

  test("chama onSave com dados válidos", async () => {
    const onSave = jest.fn().mockResolvedValue();
    render(<UseCaseForm onSave={onSave} onCancel={jest.fn()} />);

    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: "Novo Título" },
    });
    fireEvent.change(screen.getByLabelText(/descrição/i), {
      target: { value: "Alguma descrição" },
    });
    fireEvent.change(screen.getByLabelText(/ator/i), {
      target: { value: "Usuário" },
    });
    fireEvent.change(screen.getByLabelText(/pré-condições/i), {
      target: { value: "Estar logado" },
    });
    fireEvent.change(screen.getByLabelText(/pós-condições/i), {
      target: { value: "Produto cadastrado" },
    });
    fireEvent.change(screen.getByLabelText(/fluxo principal/i), {
      target: { value: "Passo 1 > Passo 2" },
    });
    fireEvent.change(screen.getByLabelText(/fluxos alternativos/i), {
      target: { value: "Outro caminho" },
    });

    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() =>
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Novo Título",
          actor: "Usuário",
        })
      )
    );
  });

  test("exibe mensagem de erro se onSave lançar erro", async () => {
    const onSave = jest.fn().mockRejectedValue(new Error("Erro ao salvar"));

    render(
      <UseCaseForm
        onSave={onSave}
        onCancel={jest.fn()}
        useCase={defaultFormData}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(await screen.findByText(/erro ao salvar/i)).toBeInTheDocument();
  });

  test("desativa inputs quando readOnly for true", () => {
    render(
      <UseCaseForm
        readOnly
        useCase={defaultFormData}
        onSave={jest.fn()}
        onCancel={jest.fn()}
      />
    );

    expect(screen.getByLabelText(/título/i)).toBeDisabled();
    expect(screen.queryByText(/salvar/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/cancelar/i)).not.toBeInTheDocument();
  });
});
