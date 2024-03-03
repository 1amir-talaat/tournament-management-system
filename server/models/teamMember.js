import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class TeamMember extends Model {}

TeamMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    sequelize,
    modelName: "team_member",
    timestamps: false,
  }
);

export default TeamMember;
