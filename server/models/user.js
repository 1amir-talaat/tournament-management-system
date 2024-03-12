import Sequelize from "sequelize";
import sequelize from "../database/connection.js";

const User = sequelize.define(
  "User",
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
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.ENUM("individual", "team"),
      allowNull: false,
      defaultValue: "individual",
    },
  },
  {
    tableName: "User",
  }
);


export default User;
