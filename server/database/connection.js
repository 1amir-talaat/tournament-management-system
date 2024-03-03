import { Sequelize } from "sequelize";

const sequelize = new Sequelize("freedb_tournament-management-system", "freedb_amirtalaat", "E?7nZj!vy?5dCC@", {
  host: "sql.freedb.tech",
  dialect: "mysql",
  logging: false,
  port: "3306",
});

export default sequelize;
