import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "../AdminRoute";
import { jwtDecode } from "jwt-decode"; // ✅ IMPORTAÇÃO NOMEADA

// ✅ Mockando a função nomeada
jest.mock("jwt-decode", () => ({
  jwtDecode: jest.fn(),
}));

const ProtectedComponent = () => <div>Área protegida do admin</div>;
const Home = () => <div>Home</div>;
const Dashboard = () => <div>Dashboard</div>;

const renderWithRouter = (tokenValue, decodedToken) => {
  if (tokenValue) {
    localStorage.setItem("token", tokenValue);
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
              <ProtectedComponent />
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
    renderWithRouter(null);
    expect(screen.getByText("Home")).toBeInTheDocument();
  });

  test("redireciona para /dashboard se não for admin", () => {
    renderWithRouter("fake-token", { role: "user" });
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  test("renderiza o conteúdo protegido se for admin", () => {
    renderWithRouter("fake-token", { role: "admin" });
    expect(screen.getByText("Área protegida do admin")).toBeInTheDocument();
  });

  test("redireciona para / se o token for inválido", () => {
    jwtDecode.mockImplementation(() => {
      throw new Error("Token inválido");
    });
    renderWithRouter("invalid-token");
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
