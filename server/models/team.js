import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

const Team = sequelize.define("Team", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_team: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

export default Team;
