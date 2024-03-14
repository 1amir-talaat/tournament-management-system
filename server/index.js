import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/routes.js";
import * as model from "./models/models.js";
import sequelize from "./database/connection.js";

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

app.use(cors());
app.use(express.json());

app.use(router);

app.listen(5002, () => console.log("Server running at port 5002"));
