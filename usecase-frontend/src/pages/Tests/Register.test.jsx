import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "../Register";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

jest.mock("axios");

beforeEach(() => {
  render(
    <BrowserRouter>
      <Register />
    </BrowserRouter>
  );
});

test("renderiza campos de nome, email, senha e confirmação", () => {
  expect(
    screen.getByPlaceholderText("Digite seu nome de usuário")
  ).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Digite seu e-mail")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Digite sua senha")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Confirme sua senha")).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: /registrar/i })
  ).toBeInTheDocument();
});

test("exibe erro se senhas não coincidirem", async () => {
  fireEvent.change(screen.getByPlaceholderText("Digite seu nome de usuário"), {
    target: { value: "Teste" },
  });
  fireEvent.change(screen.getByPlaceholderText("Digite seu e-mail"), {
    target: { value: "teste@teste.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Digite sua senha"), {
    target: { value: "123456" },
  });
  fireEvent.change(screen.getByPlaceholderText("Confirme sua senha"), {
    target: { value: "diferente" },
  });

  // Submete o formulário diretamente
  const form = screen
    .getByRole("button", { name: /registrar/i })
    .closest("form");

  fireEvent.submit(form);

  expect(
    await screen.findByText(/as senhas não coincidem/i)
  ).toBeInTheDocument();
});

test("envia dados corretos ao registrar", async () => {
  const mockResponse = {
    status: 201,
    data: { message: "Registro realizado com sucesso!" },
  };
  axios.post.mockResolvedValueOnce(mockResponse);

  fireEvent.change(screen.getByPlaceholderText("Digite seu nome de usuário"), {
    target: { value: "Usuário Teste" },
  });
  fireEvent.change(screen.getByPlaceholderText("Digite seu e-mail"), {
    target: { value: "teste@teste.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Digite sua senha"), {
    target: { value: "123456" },
  });
  fireEvent.change(screen.getByPlaceholderText("Confirme sua senha"), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: /registrar/i }));

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      expect.stringMatching(/\/auth\/register$/),
      {
        username: "Usuário Teste",
        email: "teste@teste.com",
        password: "123456",
      }
    );
  });
});
