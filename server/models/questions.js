import Sequelize from "sequelize";
import sequelize from "../database/connection.js";
import Event from "./event.js";

const Questions = sequelize.define(
  "questions",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    eventId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: "id",
      },
    },
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    answer: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "questions",
  }
);

export default Questions;
