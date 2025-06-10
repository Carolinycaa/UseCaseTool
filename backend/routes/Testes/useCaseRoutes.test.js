const request = require("supertest");
const express = require("express");
const useCaseRoutes = require("../../routes/useCaseRoutes");

const app = express();
app.use(express.json());
app.use("/", useCaseRoutes);

describe("Rotas de casos de uso", () => {
  test("GET /usecases deve retornar 401 sem token", async () => {
    const response = await request(app).get("/usecases");
    expect(response.status).toBe(401);
  });
});
