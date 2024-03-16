import express from "express";
import UserController from "../controllers/UserController.js";
import verifyToken from "../middleware/verifyToken.js";
import ParticipationController from "../controllers/participationController.js";
import EventController from "../controllers/EventController.js";
import checkEventParticipation from "../middleware/checkEventParticipation.js";

const router = express.Router();

// User routes
router.get("/user/all", verifyToken, UserController.getAllUsers);
router.get("/user/top", verifyToken, UserController.getTopUsers);
router.get("/user/:id", verifyToken, UserController.getUserById);
router.post("/user/register", UserController.register);
router.post("/user/login", UserController.login);
router.put("/user/edit/:id", verifyToken, UserController.editUser);
router.delete("/user", verifyToken, UserController.deleteUsers);
router.put("/user/changeMaxEvents", UserController.changeMaxEvents);
router.get("/refresh-token", verifyToken, UserController.refreshUserToken);

// Admin routes
router.post("/admin", verifyToken, UserController.createAdmin);
router.get("/admin/all", verifyToken, UserController.getAllAdmins);
router.put("/admin/:id", verifyToken, UserController.editAdmin);
router.delete("/admin", verifyToken, UserController.deleteAdmins);
router.get("/admin/:id", verifyToken, UserController.getAdminById);

// Participation routes
router.post("/participation/register", verifyToken, checkEventParticipation, ParticipationController.participateInEvent);
router.get("/participation/:eventId/participants", verifyToken, ParticipationController.getEventParticipants);

// Event routes
router.post("/event/create", verifyToken, EventController.createEvent);
router.get("/event/all", verifyToken, EventController.getAllEvents);
export default router;
