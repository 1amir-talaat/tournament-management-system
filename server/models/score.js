import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import EventParticipant from "./eventParticipant.js";

const Score = sequelize.define("Score", {
  value: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

Score.belongsTo(EventParticipant, { foreignKey: "participant_id" });

export default Score;
