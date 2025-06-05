const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("usecase_system", "root", "1234", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;

/*Esse arquivo é o módulo de configuração do Sequelize, responsável por conectar sua aplicação Node.js ao banco de dados MySQL.*/
