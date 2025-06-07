import React from "react";
import { render, screen } from "@testing-library/react";
import Logout from "../Logout";
import { MemoryRouter } from "react-router-dom";

// Mock de useNavigate
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

beforeEach(() => {
  localStorage.setItem("token", "fake-token");
  jest.useFakeTimers();
  mockNavigate.mockClear();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
  localStorage.clear();
});

describe("Logout", () => {
  test("remove o token e redireciona após 1 segundo", () => {
    render(
      <MemoryRouter>
        <Logout />
      </MemoryRouter>
    );

    expect(screen.getByText(/saindo da conta/i)).toBeInTheDocument();
    expect(localStorage.getItem("token")).toBeNull();

    // Avança o tempo simulado
    jest.advanceTimersByTime(1000);

    expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
  });
});
