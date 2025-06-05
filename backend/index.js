require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const useCaseRoutes = require("./routes/useCaseRoutes");
const userRoutes = require("./routes/userRoutes");
const sequelize = require("./config/database");

// Importa associações corretamente
require("./models/associations");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", useCaseRoutes);
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando!");
});

sequelize
  .sync({ force: false }) // ⚠️ cuidado com force: true em produção!
  .then(() => console.log("Banco de dados sincronizado com sucesso"))
  .catch((error) =>
    console.error("Erro ao sincronizar com o banco de dados:", error)
  );

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});
