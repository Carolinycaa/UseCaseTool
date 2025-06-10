import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import NavBar from "../NavBar";
import { jwtDecode } from "jwt-decode";

// Mock jwt-decode
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

const renderWithRoute = (initialPath = "/") => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="*" element={<NavBar />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("NavBar", () => {
  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("exibe links públicos quando não há token", () => {
    renderWithRoute("/");

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Registrar")).toBeInTheDocument();
    expect(screen.getByText("Ativar Conta")).toBeInTheDocument();
    expect(screen.queryByText("Sair")).not.toBeInTheDocument();
  });

  test("exibe links para usuário comum", () => {
    localStorage.setItem("token", "fake-token");
    jwtDecode.mockReturnValue({ role: "user" });

    renderWithRoute("/dashboard");

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Casos de Uso")).toBeInTheDocument();
    expect(screen.getByText("Sair")).toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });

  test("exibe link Admin se o usuário for admin", () => {
    localStorage.setItem("token", "admin-token");
    jwtDecode.mockReturnValue({ role: "admin" });

    renderWithRoute("/admin");

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Admin")).toBeInTheDocument();
    expect(screen.getByText("Sair")).toBeInTheDocument();
    expect(screen.queryByText("Casos de Uso")).not.toBeInTheDocument();
  });

  test("remove token inválido e exibe links públicos", () => {
    localStorage.setItem("token", "invalid-token");
    jwtDecode.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    renderWithRoute("/");

    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Sair")).not.toBeInTheDocument();
  });
});
