import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AdminRoute from "../AdminRoute";
import { jwtDecode } from "jwt-decode";

// Mock do jwt-decode
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

// Mock global para navegação
const ProtectedPage = () => <div>Conteúdo Protegido</div>;
const Dashboard = () => <div>Dashboard</div>;
const Home = () => <div>Home</div>;

const renderWithRoutes = (token, decodedToken) => {
  if (token) {
    localStorage.setItem("token", token);
    jwtDecode.mockReturnValue(decodedToken);
  } else {
    localStorage.removeItem("token");
  }

  return render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <ProtectedPage />
            </AdminRoute>
          }
        />
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </MemoryRouter>
  );
};

describe("AdminRoute", () => {
  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("redireciona para / se não houver token", () => {
    renderWithRoutes(null);
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });

  test("redireciona para /dashboard se o usuário não for admin", () => {
    renderWithRoutes("fake-token", { role: "user" });
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });

  test("renderiza a rota protegida se o usuário for admin", () => {
    renderWithRoutes("fake-token", { role: "admin" });
    expect(screen.getByText(/conteúdo protegido/i)).toBeInTheDocument();
  });

  test("redireciona para / se o token for inválido", () => {
    jwtDecode.mockImplementation(() => {
      throw new Error("Token inválido");
    });
    renderWithRoutes("invalid-token");
    expect(screen.getByText(/home/i)).toBeInTheDocument();
  });
});
