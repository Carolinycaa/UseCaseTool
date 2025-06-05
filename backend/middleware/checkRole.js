const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    next();
  };
};

module.exports = checkRole;
/*Esse arquivo define o middleware checkRole, responsável por controlar o acesso com base na função (role) do usuário, após ele já ter sido autenticado com JWT. */
