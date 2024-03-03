import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import Team from "./team.js";
import Event from "./event.js";

const EventParticipant = sequelize.define("EventParticipant", {});

EventParticipant.belongsTo(Team, { foreignKey: "team_id" });
EventParticipant.belongsTo(Event, { foreignKey: "event_id" });

export default EventParticipant;
