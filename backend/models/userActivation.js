const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const UserActivation = sequelize.define(
  "userActivation", // nome da tabela, respeitando o que tem no banco
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "userId", // campo no banco, já está assim mesmo
    },
    activationCode: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "activationCode",
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "createdAt",
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: "updatedAt",
    },
  },
  {
    tableName: "userActivation",
    timestamps: true,
    underscored: false, // porque tabela não está com snake_case
  }
);

module.exports = UserActivation;
