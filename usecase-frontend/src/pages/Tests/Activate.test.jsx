// __tests__/Activate.test.jsx
import React from "react";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Activate from "../Activate";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";

// Ativa timers falsos do Jest
jest.useFakeTimers();

// Mocks
jest.mock("axios");
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => ({ state: { email: "test@example.com" } }),
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => <a href={to}>{children}</a>,
}));

describe("Activate component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renderiza o formulário com campos preenchidos", () => {
    render(
      <MemoryRouter>
        <Activate />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toHaveValue("test@example.com");
    expect(screen.getByLabelText(/código de ativação/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ativar conta/i })).toBeEnabled();
  });

  test("envia o formulário com sucesso e redireciona", async () => {
    axios.post.mockResolvedValue({
      data: { message: "Conta ativada com sucesso" },
    });

    render(
      <MemoryRouter>
        <Activate />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/código de ativação/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ativar conta/i }));

    expect(screen.getByRole("button", { name: /ativando/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Conta ativada com sucesso"
      );
    });

    // Simula o tempo para disparar o setTimeout
    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  test("exibe mensagem de erro quando falha na ativação", async () => {
    axios.post.mockRejectedValue({
      response: {
        data: {
          message: "Código inválido",
        },
      },
    });

    render(
      <MemoryRouter>
        <Activate />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/código de ativação/i), {
      target: { value: "wrong-code" },
    });
    fireEvent.click(screen.getByRole("button", { name: /ativar conta/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toHaveTextContent("Código inválido");
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
