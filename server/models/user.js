import Sequelize from "sequelize";
import sequelize from "../database/connection.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    isTeam: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    maxEvents: {
      type: Sequelize.INTEGER,
    },
    points: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
  },
  {
    tableName: "User",
  }
);

export default User;
