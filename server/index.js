import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/routes.js";
import sequelize from "./database/connection.js";
import User from "./models/user.js";
import Team from "./models/team.js";
import Role from "./models/role.js";
import Event from "./models/event.js";
import EventParticipant from "./models/eventParticipant.js";
import Score from "./models/score.js";

dotenv.config();

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    await sequelize.sync({ force: false });

    console.log("Models synchronized with the database.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

initializeDatabase();

dotenv.config();

const app = express();

app.use(express.json({ limit: "16mb" }));

app.use(cors());
app.use(express.json());

app.use(router);

app.listen(5000, () => console.log("Server running at port 5000"));
