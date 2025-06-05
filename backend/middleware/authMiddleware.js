const jwt = require("jsonwebtoken");
require("dotenv").config();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido." });

    req.user = user; // salva os dados do usuário no request
    next();
  });
};

module.exports = authenticateToken;
/*Esse arquivo implementa o middleware de autenticação com JWT. Ele serve para proteger rotas e garantir que apenas usuários autenticados consigam acessá-las. */
