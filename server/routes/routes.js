import express from "express";
import UserController from "../controllers/UserController.js";
// import TeamController from "../controllers/TeamController.js";
// import EventController from "../controllers/EventController.js";
// import ScoreController from "../controllers/ScoreController.js";
// import TeamParticipantController from "../controllers/TeamParticipantController.js";

import authenticateMiddleware from "../middleware/authenticateMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
const router = express.Router();

// User routes
router.get("/users", authenticateMiddleware, roleMiddleware([3, 2]), UserController.getAllUsers);
router.get("/users/:id", authenticateMiddleware, roleMiddleware([3, 2]), UserController.getUserById);
router.post("/register", UserController.register);
router.post("/login", UserController.login);
router.post("/admin", authenticateMiddleware, roleMiddleware([3]), UserController.addAdmin);

// // Team routes
// router.get("/teams", TeamController.getAllTeams);
// router.get("/teams/:id", TeamController.getTeamById);
// router.post("/teams", TeamController.createTeam);
// router.put("/teams/:id", TeamController.updateTeam);
// router.delete("/teams/:id", TeamController.deleteTeam);

// // Event routes
// router.get("/events", EventController.getAllEvents);
// router.get("/events/:id", EventController.getEventById);
// router.post("/events", EventController.createEvent);
// router.put("/events/:id", EventController.updateEvent);
// router.delete("/events/:id", EventController.deleteEvent);

// // Score routes
// router.get("/scores", ScoreController.getAllScores);
// router.get("/scores/:id", ScoreController.getScoreById);
// router.post("/scores", ScoreController.createScore);
// router.put("/scores/:id", ScoreController.updateScore);
// router.delete("/scores/:id", ScoreController.deleteScore);

// // Team participant routes
// router.post("/teamparticipants", TeamParticipantController.createTeamParticipant);
// router.get("/teamparticipants/:eventId", TeamParticipantController.getTeamParticipantsByEvent);

export default router;
