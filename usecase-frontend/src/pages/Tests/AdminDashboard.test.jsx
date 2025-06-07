import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "../AdminDashboard";

describe("AdminDashboard", () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );
  });

  test("renderiza título e descrição principais", () => {
    expect(
      screen.getByRole("heading", { name: /painel do administrador/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/acesse as áreas administrativas do sistema/i)
    ).toBeInTheDocument();
  });

  test("renderiza o card de gerenciamento de usuários", () => {
    expect(
      screen.getByRole("link", { name: /gerenciar usuários/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/visualize, edite e altere permissões dos usuários/i)
    ).toBeInTheDocument();
  });

  test("renderiza o card de gerenciamento de use cases", () => {
    expect(
      screen.getByRole("link", { name: /gerenciar use cases/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/crie, edite e organize seus casos de uso/i)
    ).toBeInTheDocument();
  });
});
