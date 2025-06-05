import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Login";
import axios from "axios";
import { BrowserRouter } from "react-router-dom";

// Mock do axios
jest.mock("axios");

beforeEach(() => {
  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );
});

test("renderiza campos de email e senha", () => {
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument(); // <-- corrigido aqui
});

test("exibe mensagem de erro se os campos estiverem vazios", async () => {
  fireEvent.click(screen.getByRole("button", { name: /entrar/i })); // <-- corrigido aqui
  expect(
    await screen.findByText(/preencha todos os campos/i)
  ).toBeInTheDocument();
});

test("envia dados corretos ao fazer login", async () => {
  const mockResponse = { data: { token: "fake-token" } };
  axios.post.mockResolvedValueOnce(mockResponse);

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "teste@teste.com" },
  });
  fireEvent.change(screen.getByLabelText(/senha/i), {
    target: { value: "123456" },
  });

  fireEvent.click(screen.getByRole("button", { name: /entrar/i })); // <-- corrigido aqui

  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith(
      "http://localhost:3001/api/auth/login",
      {
        email: "teste@teste.com",
        password: "123456",
      }
    );
  });
});
