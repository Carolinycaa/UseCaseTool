const express = require("express");
const router = express.Router();
const UseCase = require("../models/useCase");
const UseCaseHistory = require("../models/useCaseHistory");
const User = require("../models/user");
const authenticateToken = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

// ✅ Criar um novo caso de uso (apenas admin e editor)
router.post(
  "/use-cases",
  authenticateToken,
  checkRole(["admin", "editor"]),
  async (req, res) => {
    const {
      title,
      description,
      actor,
      preconditions,
      postconditions,
      main_flow,
      alternative_flows,
      exceptions,
    } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Título e descrição são obrigatórios." });
    }

    try {
      const newUseCase = await UseCase.create({
        title,
        description,
        actor,
        preconditions,
        postconditions,
        main_flow,
        alternative_flows,
        exceptions,
        created_by: req.user.id,
      });

      return res.status(201).json({
        message: "Caso de uso criado com sucesso!",
        useCase: newUseCase,
      });
    } catch (err) {
      console.error("Erro ao criar o caso de uso:", err);
      return res
        .status(500)
        .json({ error: "Erro inesperado ao criar o caso de uso." });
    }
  }
);

// ✅ Listar todos os casos de uso (admin, editor, visualizador)
router.get(
  "/usecases",
  authenticateToken,
  checkRole(["admin", "editor", "visualizador"]),
  async (req, res) => {
    try {
      const useCases = await UseCase.findAll({
        order: [["createdAt", "DESC"]],
        include: {
          model: User,
          as: "creator", // 🔧 alias definido na associação
          attributes: ["id", "username", "email"],
        },
      });

      return res.json(useCases);
    } catch (err) {
      console.error("Erro ao buscar casos de uso:", err);
      return res.status(500).json({ message: "Erro ao buscar casos de uso." });
    }
  }
);

// ✅ Atualizar um caso de uso (admin e editor)
router.put(
  "/use-cases/:id",
  authenticateToken,
  checkRole(["admin", "editor"]),
  async (req, res) => {
    const { id } = req.params;
    const {
      title,
      description,
      actor,
      preconditions,
      postconditions,
      main_flow,
      alternative_flows,
      exceptions,
    } = req.body;

    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Título e descrição são obrigatórios." });
    }

    try {
      const useCase = await UseCase.findByPk(id);

      if (!useCase) {
        return res.status(404).json({ error: "Caso de uso não encontrado." });
      }

      if (useCase.created_by !== req.user.id && req.user.role !== "admin") {
        return res.status(403).json({ error: "Acesso não autorizado." });
      }

      await UseCaseHistory.create({
        use_case_id: useCase.id,
        title: useCase.title,
        description: useCase.description,
        actor: useCase.actor,
        preconditions: useCase.preconditions,
        postconditions: useCase.postconditions,
        main_flow: useCase.main_flow,
        alternative_flows: useCase.alternative_flows,
        exceptions: useCase.exceptions,
        edited_by: req.user.id,
      });

      useCase.title = title;
      useCase.description = description;
      useCase.actor = actor;
      useCase.preconditions = preconditions;
      useCase.postconditions = postconditions;
      useCase.main_flow = main_flow;
      useCase.alternative_flows = alternative_flows;
      useCase.exceptions = exceptions;

      await useCase.save();

      return res.status(200).json({
        message: "Caso de uso atualizado com sucesso!",
        useCase,
      });
    } catch (err) {
      console.error("Erro ao atualizar caso de uso:", err);
      return res.status(500).json({ error: "Erro ao atualizar caso de uso." });
    }
  }
);

// ✅ Deletar um caso de uso (apenas admin)
router.delete(
  "/use-cases/:id",
  authenticateToken,
  checkRole(["admin"]),
  async (req, res) => {
    const { id } = req.params;

    try {
      const useCase = await UseCase.findByPk(id);

      if (!useCase) {
        return res.status(404).json({ error: "Caso de uso não encontrado." });
      }

      await useCase.destroy();

      return res
        .status(200)
        .json({ message: "Caso de uso excluído com sucesso!" });
    } catch (err) {
      console.error("Erro ao excluir caso de uso:", err);
      return res.status(500).json({ error: "Erro ao excluir caso de uso." });
    }
  }
);

// ✅ Histórico de um caso de uso (apenas admin)
router.get(
  "/use-cases/:id/history",
  authenticateToken,
  checkRole(["admin"]),
  async (req, res) => {
    try {
      const history = await UseCaseHistory.findAll({
        where: { use_case_id: req.params.id },
        order: [["edited_at", "DESC"]],
        include: {
          model: User,
          attributes: ["id", "username", "email"],
        },
      });

      return res.status(200).json(history);
    } catch (err) {
      console.error("Erro ao buscar histórico:", err);
      return res
        .status(500)
        .json({ error: "Erro ao buscar histórico de mudanças." });
    }
  }
);

// ✅ Buscar um caso de uso pelo ID (admin, editor ou visualizador)
router.get(
  "/use-cases/:id",
  authenticateToken,
  checkRole(["admin", "editor", "visualizador"]),
  async (req, res) => {
    try {
      const useCase = await UseCase.findByPk(req.params.id);
      if (!useCase) {
        return res.status(404).json({ error: "Caso de uso não encontrado." });
      }

      res.json(useCase);
    } catch (err) {
      console.error("Erro ao buscar caso de uso:", err);
      res.status(500).json({ error: "Erro ao buscar caso de uso." });
    }
  }
);

module.exports = router;
