import Sequelize from "sequelize";
import sequelize from "../database/connection.js";

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM("individual", "team"),
      allowNull: false,
    },
    eventType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Event",
  }
);

export default Event;
