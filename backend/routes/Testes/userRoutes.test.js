const request = require("supertest");
const express = require("express");
const userRoutes = require("../userRoutes");

const User = require("../../models/user");

jest.mock("../../models/user");

const app = express();
app.use(express.json());
app.use("/", userRoutes);

// Simulação de middleware para testes
jest.mock("../../middleware/authMiddleware", () => (req, res, next) => next());
jest.mock("../../middleware/checkRole", () => () => (req, res, next) => next());

describe("Rotas administrativas de usuários", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("GET /users deve retornar lista de usuários", async () => {
    const mockUsers = [
      {
        id: 1,
        username: "admin",
        email: "admin@email.com",
        role: "admin",
        active: true,
        createdAt: new Date("2025-06-07T21:37:26.116Z").toISOString(), // corrigido
      },
    ];
    User.findAll.mockResolvedValue(mockUsers);

    const res = await request(app).get("/users");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUsers);
  });

  test("PUT /users/:id/role deve atualizar o papel do usuário", async () => {
    const mockUser = {
      id: 2,
      role: "editor",
      save: jest.fn().mockResolvedValue(true),
    };
    User.findByPk.mockResolvedValue(mockUser);

    const res = await request(app).put("/users/2/role").send({ role: "admin" });

    expect(res.status).toBe(200);
    expect(mockUser.role).toBe("admin");
    expect(mockUser.save).toHaveBeenCalled();
    expect(res.body).toEqual({ message: "Papel atualizado com sucesso." });
  });

  test("PUT /users/:id/role deve retornar erro se o papel for inválido", async () => {
    const res = await request(app)
      .put("/users/2/role")
      .send({ role: "invalido" });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Papel inválido.");
  });

  test("PUT /users/:id/role deve retornar 404 se usuário não for encontrado", async () => {
    User.findByPk.mockResolvedValue(null);

    const res = await request(app).put("/users/2/role").send({ role: "admin" });
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Usuário não encontrado.");
  });
});
