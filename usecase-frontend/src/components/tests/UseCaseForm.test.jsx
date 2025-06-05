// src/components/__tests__/UseCaseForm.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import UseCaseForm from "../UseCaseForm";

describe("UseCaseForm", () => {
  it("renderiza todos os campos obrigatórios", () => {
    render(<UseCaseForm onSave={() => {}} onCancel={() => {}} />);

    expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Descrição/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ator/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pré-condições/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pós-condições/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fluxo principal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fluxos alternativos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Exceções/i)).toBeInTheDocument();
  });

  it("mostra erro se título e descrição estiverem vazios", async () => {
    const { getByText } = render(
      <UseCaseForm onSave={() => {}} onCancel={() => {}} />
    );

    fireEvent.click(getByText(/Salvar/i));

    expect(
      await screen.findByText(/Preencha todos os campos obrigatórios/i)
    ).toBeInTheDocument();
  });
});
