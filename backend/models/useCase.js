const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UseCase = sequelize.define(
  "use_case",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "use_case",
    timestamps: false, // já temos created_at, updated_at manualmente
  }
);

module.exports = UseCase;

//Esse arquivo define o modelo UseCase usando Sequelize, que mapeia uma tabela do banco de dados chamada use_case. Ele representa os casos de uso no seu sistema
