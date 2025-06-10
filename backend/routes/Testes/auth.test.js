const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const authRoutes = require("../auth");
const User = require("../../models/user");
const UserActivation = require("../../models/userActivation");

jest.mock("../../models/user");
jest.mock("../../models/userActivation");
jest.mock("nodemailer", () => ({
  createTransport: () => ({
    sendMail: jest.fn((options, callback) =>
      callback(null, { response: "OK" })
    ),
  }),
}));

const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);

describe("Auth Routes", () => {
  afterEach(() => jest.clearAllMocks());

  describe("POST /register", () => {
    it("deve registrar um novo usuário com sucesso", async () => {
      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue({ id: 1, email: "test@example.com" });
      UserActivation.create.mockResolvedValue({});

      const response = await request(app).post("/api/auth/register").send({
        username: "user",
        email: "test@example.com",
        password: "123456",
      });

      expect(response.statusCode).toBe(201);
      expect(response.body.message).toContain("Verifique seu e-mail");
    });
  });

  describe("POST /login", () => {
    it("deve retornar erro se usuário não existir", async () => {
      User.findOne.mockResolvedValue(null);

      const response = await request(app).post("/api/auth/login").send({
        email: "notfound@example.com",
        password: "123456",
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe("POST /activate", () => {
    it("deve ativar um usuário com sucesso", async () => {
      const fakeUser = { id: 1, email: "a@a.com", save: jest.fn() };
      const fakeCode = { destroy: jest.fn() };

      User.findOne.mockResolvedValue(fakeUser);
      UserActivation.findOne.mockResolvedValue(fakeCode);

      const response = await request(app).post("/api/auth/activate").send({
        email: "a@a.com",
        code: "12345",
      });

      expect(response.statusCode).toBe(200);
      expect(response.body.message).toContain("ativado com sucesso");
    });
  });
});
