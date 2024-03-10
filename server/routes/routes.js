import express from "express";
import UserController from "../controllers/UserController.js";
import authenticateMiddleware from "../middleware/verifyToken.js";
import TeamController from "../controllers/TeamController.js";
import ParticipationController from "../controllers/participationController.js";
import EventController from "../controllers/EventController.js";

const router = express.Router();

// User routes
router.get("/user/all", authenticateMiddleware, UserController.getAllUsers);
router.get("/user/:id", authenticateMiddleware, UserController.getUserById);
router.post("/user/register", UserController.register);
router.post("/user/login", UserController.login);
router.put("/user/:id", authenticateMiddleware, UserController.editUser); // Define the edit user route here
router.delete("/user", authenticateMiddleware, UserController.deleteUsers);
router.post("/add/admin", authenticateMiddleware, UserController.createAdmin);

// Team routes
router.post("/team/create", authenticateMiddleware, TeamController.createTeam);
router.get("/team/", authenticateMiddleware, TeamController.getAllTeams);
router.delete("/team/:teamId", authenticateMiddleware, TeamController.deleteTeam);
router.get("/team/user", authenticateMiddleware, TeamController.getTeamByUserId);

// Participation routes
router.post("/participation/register", authenticateMiddleware, ParticipationController.participateInEvent);
router.get("/participation/:eventId/participants", authenticateMiddleware, ParticipationController.getEventParticipants);
router.get("/participation/count", authenticateMiddleware, ParticipationController.getUserEventCount);

// Event routes
router.post("/event/create", authenticateMiddleware, EventController.createEvent);
router.get("/event/all", EventController.getAllEvents);

export default router;
