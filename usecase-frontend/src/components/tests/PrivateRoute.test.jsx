import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";

// Componente protegido fictício para testar
const ProtectedContent = () => <div>Conteúdo Protegido</div>;

describe("PrivateRoute", () => {
  afterEach(() => {
    localStorage.clear();
  });

  const renderWithRouter = () =>
    render(
      <MemoryRouter initialEntries={["/protegido"]}>
        <Routes>
          <Route
            path="/protegido"
            element={
              <PrivateRoute>
                <ProtectedContent />
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>Página de Login</div>} />
        </Routes>
      </MemoryRouter>
    );

  test("redireciona para /login se não houver token", () => {
    renderWithRouter();

    expect(screen.getByText("Página de Login")).toBeInTheDocument();
    expect(screen.queryByText("Conteúdo Protegido")).not.toBeInTheDocument();
  });

  test("renderiza o conteúdo protegido se houver token", () => {
    localStorage.setItem("token", "fake-token");

    renderWithRouter();

    expect(screen.getByText("Conteúdo Protegido")).toBeInTheDocument();
    expect(screen.queryByText("Página de Login")).not.toBeInTheDocument();
  });
});
