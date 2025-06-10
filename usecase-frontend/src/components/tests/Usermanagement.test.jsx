import React from "react";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react";
import UserManagement from "../Usermanagement";

describe("UserManagement", () => {
  beforeEach(() => {
    localStorage.setItem("token", "fake-token");
    global.fetch = jest.fn();
  });

  afterEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renderiza corretamente e busca usuários com sucesso", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve([
          { id: 1, username: "admin", email: "admin@email.com", role: "admin" },
        ]),
    });

    render(<UserManagement />);

    expect(screen.getByText(/carregando usuários/i)).toBeInTheDocument();

    await waitFor(() => {
      const emailCell = screen.getByText("admin@email.com");
      expect(emailCell).toBeInTheDocument();

      const row = emailCell.closest("tr");
      const select = within(row).getByRole("combobox");
      expect(select.value).toBe("admin");
    });
  });

  test("exibe erro ao falhar em buscar usuários", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({}),
    });

    render(<UserManagement />);

    await waitFor(() => {
      expect(screen.getByText(/erro ao buscar usuários/i)).toBeInTheDocument();
    });
  });

  test("altera papel do usuário com sucesso", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 1,
              username: "joao",
              email: "joao@email.com",
              role: "editor",
            },
          ]),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ message: "Atualizado com sucesso" }),
      });

    render(<UserManagement />);

    const row = await screen
      .findByText("joao@email.com")
      .then((el) => el.closest("tr"));
    const select = within(row).getByRole("combobox");

    fireEvent.change(select, { target: { value: "admin" } });

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/users/1/role"),
        expect.objectContaining({ method: "PUT" })
      );
    });
  });

  test("exibe erro ao falhar ao alterar papel do usuário", async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: 2,
              username: "maria",
              email: "maria@email.com",
              role: "visualizador",
            },
          ]),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: "Erro ao atualizar" }),
      });

    render(<UserManagement />);

    const row = await screen
      .findByText("maria@email.com")
      .then((el) => el.closest("tr"));
    const select = within(row).getByRole("combobox");

    fireEvent.change(select, { target: { value: "editor" } });

    await waitFor(() => {
      expect(screen.getByText("Erro ao atualizar")).toBeInTheDocument();
    });
  });
});
