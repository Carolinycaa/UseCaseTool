// __tests__/AdminDashboard.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import AdminDashboard from "../AdminDashboard";
import { MemoryRouter } from "react-router-dom";

describe("AdminDashboard", () => {
  test("renderiza título, subtítulo e cartões com links", () => {
    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );

    // Verifica título e subtítulo
    expect(
      screen.getByRole("heading", { name: /painel do administrador/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/acesse as áreas administrativas/i)
    ).toBeInTheDocument();

    // Verifica os dois cards
    expect(
      screen.getByRole("heading", { name: /gerenciar usuários/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/visualize, edite e altere permissões dos usuários/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /gerenciar casos de uso/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/crie, edite e organize seus casos de uso/i)
    ).toBeInTheDocument();

    // Verifica se os links existem
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute("href", "/admin/users");
    expect(links[1]).toHaveAttribute("href", "/admin/usecases");
  });
});
