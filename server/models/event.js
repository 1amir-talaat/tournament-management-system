import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";

const Event = sequelize.define("Event", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  participation_type: {
    type: DataTypes.ENUM("Individual", "Team"),
    allowNull: false,
  },
});

export default Event;
