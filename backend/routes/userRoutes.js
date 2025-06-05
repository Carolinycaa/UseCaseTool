const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authenticateToken = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

// Listar todos os usuários (somente admin)
router.get(
  "/users",
  authenticateToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ["id", "username", "email", "role", "active", "createdAt"],
        order: [["createdAt", "DESC"]],
      });
      res.json(users);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
      res.status(500).json({ error: "Erro ao buscar usuários." });
    }
  }
);

// Atualizar role do usuário (somente admin)
router.put(
  "/users/:id/role",
  authenticateToken,
  checkRole(["admin"]),
  async (req, res) => {
    const { role } = req.body;

    if (!["admin", "editor", "visualizador"].includes(role)) {
      return res.status(400).json({ message: "Papel inválido." });
    }

    const user = await User.findByPk(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuário não encontrado." });

    user.role = role;
    await user.save();

    res.json({ message: "Papel atualizado com sucesso." });
  }
);

module.exports = router;
