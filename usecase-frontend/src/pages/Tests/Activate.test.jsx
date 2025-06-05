import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, MemoryRouter } from "react-router-dom";
import Activate from "../Activate";
import axios from "axios";

jest.mock("axios");

const renderWithRouter = (ui, { route = "/activate", state = {} } = {}) => {
  window.history.pushState({ state }, "Activate", route);
  return render(
    <MemoryRouter initialEntries={[{ pathname: route, state }]}>
      {ui}
    </MemoryRouter>
  );
};

describe("Página de Ativação", () => {
  beforeEach(() => {
    renderWithRouter(<Activate />, { state: { email: "teste@teste.com" } });
  });

  test("renderiza campo de código e botão", () => {
    expect(
      screen.getByPlaceholderText(/digite o código recebido/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ativar conta/i })
    ).toBeInTheDocument();
  });

  test("envia código de ativação corretamente", async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: { message: "Conta ativada!" },
    });

    fireEvent.change(screen.getByPlaceholderText(/digite o código recebido/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ativar conta/i }));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringMatching(/\/auth\/activate$/),
        { email: "teste@teste.com", code: "123456" }
      );
    });

    expect(await screen.findByText(/conta ativada/i)).toBeInTheDocument();
  });

  test("exibe erro se código estiver incorreto", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        data: {
          errors: [{ msg: "Código inválido" }],
        },
      },
    });

    fireEvent.change(screen.getByPlaceholderText(/digite o código recebido/i), {
      target: { value: "000000" },
    });

    fireEvent.click(screen.getByRole("button", { name: /ativar conta/i }));

    expect(await screen.findByText(/código inválido/i)).toBeInTheDocument();
  });
});
