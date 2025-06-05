const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const UseCaseHistory = sequelize.define(
  "use_case_history",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    use_case_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.TEXT,
    },
    actor: {
      type: DataTypes.TEXT,
    },
    preconditions: {
      type: DataTypes.TEXT,
    },
    postconditions: {
      type: DataTypes.TEXT,
    },
    main_flow: {
      type: DataTypes.TEXT,
    },
    alternative_flows: {
      type: DataTypes.TEXT,
    },
    exceptions: {
      type: DataTypes.TEXT,
    },
    edited_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    edited_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "use_case_history",
    timestamps: false,
  }
);
UseCaseHistory.associate = (models) => {
  UseCaseHistory.belongsTo(models.User, {
    foreignKey: "edited_by",
    as: "editor",
  });
};

module.exports = UseCaseHistory;

//Esse arquivo define o modelo UseCaseHistory usando Sequelize. Ele representa o histórico de edições de casos de uso, armazenando versões anteriores ou alterações feitas.
