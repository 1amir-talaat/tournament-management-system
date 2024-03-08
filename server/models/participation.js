import Sequelize from "sequelize";
import sequelize from "../database/connection.js";
import User from "./user.js";
import Team from "./team.js";
import Event from "./event.js";

const Participation = sequelize.define(
  "Participation",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    teamId: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: Team,
        key: "id",
      },
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
    },
    eventId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: Event,
        key: "id",
      },
    },
    rank: {
      type: Sequelize.INTEGER,
    },
    points: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: "Participation",
  }
);

export default Participation;
