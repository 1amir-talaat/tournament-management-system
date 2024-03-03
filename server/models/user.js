import { DataTypes } from "sequelize";
import sequelize from "../database/connection.js";
import Role from "./role.js";
import Team from "./team.js";

const User = sequelize.define("User", {
  full_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  team_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  is_leader: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
});

User.belongsTo(Role, { foreignKey: "role_id" });
User.belongsTo(Team, { foreignKey: "team_id" });

export default User;
