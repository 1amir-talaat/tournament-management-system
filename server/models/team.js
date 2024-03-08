import Sequelize from "sequelize";
import sequelize from "../database/connection.js";

const Team = sequelize.define(
  "Team",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    teamName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Team",
  }
);

export default Team;
