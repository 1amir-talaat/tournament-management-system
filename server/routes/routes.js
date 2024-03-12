import express from "express";
import UserController from "../controllers/UserController.js";
import authenticateMiddleware from "../middleware/verifyToken.js";
import ParticipationController from "../controllers/participationController.js";
import EventController from "../controllers/EventController.js";

const router = express.Router();

// User routes
router.get("/user/all", authenticateMiddleware, UserController.getAllUsers);
router.get("/user/:id", authenticateMiddleware, UserController.getUserById);
router.post("/user/register", UserController.register);
router.post("/user/login", UserController.login);
router.put("/user/:id", authenticateMiddleware, UserController.editUser);
router.delete("/user", authenticateMiddleware, UserController.deleteUsers);

// Admin routes
router.post("/admin", authenticateMiddleware, UserController.createAdmin);
router.get("/admin/all", authenticateMiddleware, UserController.getAllAdmins);
router.put("/admin/:id", authenticateMiddleware, UserController.editAdmin);
router.delete("/admin", authenticateMiddleware, UserController.deleteAdmins);
router.get("/admin/:id", authenticateMiddleware, UserController.getAdminById);

// Participation routes
router.post("/participation/register", authenticateMiddleware, ParticipationController.participateInEvent);
router.get("/participation/:eventId/participants", authenticateMiddleware, ParticipationController.getEventParticipants);
router.get("/participation/count", authenticateMiddleware, ParticipationController.getUserEventCount);

// Event routes
router.post("/event/create", authenticateMiddleware, EventController.createEvent);
router.get("/event/all", EventController.getAllEvents);

export default router;
