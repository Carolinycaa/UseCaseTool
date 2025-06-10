import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Logout from "../Logout";

import { MemoryRouter } from "react-router-dom";

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("Logout Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "fake-token");
  });

  it("remove o token do localStorage ao montar", () => {
    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );

    expect(localStorage.getItem("token")).toBeNull();
  });

  it("renderiza mensagem de saída", () => {
    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );

    expect(screen.getByText(/saindo da conta/i)).toBeInTheDocument();
    expect(screen.getByText(/você será redirecionado/i)).toBeInTheDocument();
  });

  it("redireciona após 1 segundo", async () => {
    jest.useFakeTimers();

    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );

    // Avança o tempo simulado
    jest.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });

    jest.useRealTimers();
  });
});
