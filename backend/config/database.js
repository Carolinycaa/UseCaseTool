const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("usecase_system", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;

/*Cria uma instância do Sequelize conectando ao banco usecase_system usando o usuário root e senha 1234.

Define o host como localhost e o dialect como mysql.

Exporta essa conexão para ser usada em outros arquivos (index.js, models, etc.).*/
