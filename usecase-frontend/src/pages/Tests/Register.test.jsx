import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../Register";
import { MemoryRouter } from "react-router-dom";
import axios from "axios";

// Mock de navegação
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ to, children }) => <a href={to}>{children}</a>,
  };
});

// Mock do axios
jest.mock("axios");

describe("Register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renderiza corretamente os campos do formulário", () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/nome de usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^senha$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirmar senha/i)).toBeInTheDocument();
  });

  it("exibe mensagem de erro se senhas não coincidirem", async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
      target: { value: "joao" },
    });
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "joao@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "diferente" },
    });

    // Simula envio do formulário apesar do botão estar desativado
    fireEvent.submit(screen.getByTestId("register-form"));

    const errorMessage = await screen.findByText((text) =>
      text.toLowerCase().includes("senhas não coincidem")
    );
    expect(errorMessage).toBeInTheDocument();
  });

  it("realiza registro com sucesso e redireciona", async () => {
    axios.post.mockResolvedValueOnce({
      status: 201,
      data: { message: "Conta criada com sucesso" },
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
      target: { value: "joao" },
    });
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "joao@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /registrar/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/activate", {
        state: { email: "joao@email.com" },
      });
    });

    expect(screen.queryByText(/erro/i)).not.toBeInTheDocument();
  });

  it("exibe mensagem de erro se a API falhar", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          errors: [{ msg: "Email já cadastrado" }],
        },
      },
    });

    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/nome de usuário/i), {
      target: { value: "joao" },
    });
    fireEvent.change(screen.getByLabelText(/e-mail/i), {
      target: { value: "joao@email.com" },
    });
    fireEvent.change(screen.getByLabelText(/^senha$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /registrar/i }));

    expect(await screen.findByText(/email já cadastrado/i)).toBeInTheDocument();
  });
});
