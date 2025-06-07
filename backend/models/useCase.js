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
      allowNull: false,
    },
    actor: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    preconditions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    postconditions: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    main_flow: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    alternative_flows: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    exceptions: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    timestamps: false,
  }
);

module.exports = UseCase;
