import Sequelize from "sequelize";
import sequelize from "../database/connection.js";

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.ENUM("admin", "superadmin"),
      allowNull: false,
      defaultValue: "admin",
    },
  },
  {
    tableName: "Admin",
  }
);

export default Admin;
