const User = require("./user");
const UseCase = require("./useCase");
const UseCaseHistory = require("./useCaseHistory");

// Associação: um caso de uso pertence a um usuário (criador)
UseCase.belongsTo(User, {
  foreignKey: "created_by",
  as: "creator",
});

// Um usuário pode ter vários casos de uso
User.hasMany(UseCase, {
  foreignKey: "created_by",
  as: "createdUseCases",
});

// Associação: histórico pertence ao usuário que editou
UseCaseHistory.belongsTo(User, {
  foreignKey: "edited_by",
  as: "editor",
});

//Esse arquivo configura relacionamentos entre tabelas: user.js, useCase.js e useCaseHistory.js
