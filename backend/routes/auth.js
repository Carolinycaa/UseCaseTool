require("dotenv").config();
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const User = require("../models/user");
const UserActivation = require("../models/userActivation");
const authenticateToken = require("../middleware/authMiddleware");
const checkRole = require("../middleware/checkRole");

const SECRET_KEY = process.env.JWT_SECRET;

// 📧 Configuração do e-mail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// 🔑 Geração de código de ativação
const generateActivationCode = () => {
  return crypto.randomBytes(3).toString("hex").slice(0, 5);
};

// 📤 Envio de e-mail de ativação
const sendActivationEmail = (email, activationCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Ativação de Conta",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 10px;">
        <h2>Bem-vindo à nossa plataforma!</h2>
        <p>Use o código abaixo para ativar sua conta:</p>
        <h3 style="color: #007bff;">${activationCode}</h3>
      </div>
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Erro ao enviar e-mail:", error);
    } else {
      console.log("E-mail enviado: " + info.response);
    }
  });
};

// ✅ REGISTRO
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username é obrigatório."),
    body("email").isEmail().withMessage("Email inválido."),
    body("password")
      .isLength({ min: 6 })
      .withMessage("A senha precisa ter no mínimo 6 caracteres."),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          errors: [{ msg: "Usuário já existe.", param: "email" }],
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: "visualizador",
        active: false,
      });

      const activationCode = generateActivationCode();
      await UserActivation.create({
        userId: user.id,
        activationCode,
      });

      sendActivationEmail(user.email, activationCode);

      return res.status(201).json({
        message:
          "Usuário registrado com sucesso! Verifique seu e-mail para ativação.",
      });
    } catch (err) {
      console.error("Erro inesperado:", err);
      return res.status(500).json({
        errors: [{ msg: err.message || "Erro desconhecido." }],
      });
    }
  }
);

// ✅ LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      errors: [{ msg: "Email e senha são obrigatórios." }],
    });
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({
        errors: [{ msg: "Usuário não encontrado.", param: "email" }],
      });
    }

    if (!user.active) {
      return res.status(400).json({
        errors: [{ msg: "Usuário não ativado. Verifique seu e-mail." }],
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        errors: [{ msg: "Senha incorreta.", param: "password" }],
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login realizado com sucesso!",
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      errors: [{ msg: "Erro ao realizar login." }],
    });
  }
});

// ✅ ATIVAÇÃO
router.post("/activate", async (req, res) => {
  const { email, code } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res
        .status(404)
        .json({ errors: [{ msg: "Usuário não encontrado!" }] });
    }

    const activationRecord = await UserActivation.findOne({
      where: { userId: user.id, activationCode: code },
    });

    if (!activationRecord) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Código de ativação inválido!" }] });
    }

    user.active = true;
    await user.save();
    await activationRecord.destroy();

    res.status(200).json({ message: "Usuário ativado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: "Erro ao ativar o usuário." }] });
  }
});

// ✅ EXCLUIR USUÁRIO (admin)
router.delete(
  "/delete-user/:id",
  authenticateToken,
  checkRole(["admin"]),
  async (req, res) => {
    const targetUserId = req.params.id;

    try {
      const userToDelete = await User.findByPk(targetUserId);
      if (!userToDelete) {
        return res.status(404).json({
          errors: [{ msg: "Usuário não encontrado." }],
        });
      }

      await userToDelete.destroy();
      res.json({ message: "Usuário excluído com sucesso!" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        errors: [{ msg: "Erro ao excluir usuário." }],
      });
    }
  }
);

module.exports = router;
