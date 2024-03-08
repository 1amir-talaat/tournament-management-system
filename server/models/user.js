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
    inTeam: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    currentTeamId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Team",
        key: "id",
      },
    },
  },
  {
    tableName: "User",
  }
);

export default User;
