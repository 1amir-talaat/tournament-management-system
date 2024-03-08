import { Event, Participation } from "../models/models.js";

class EventController {
  static createEvent = async (req, res) => {
    if (!req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized - Admin access required" });
    }

    const { eventName, type, eventType } = req.body;

    try {
      const newEvent = await Event.create({ eventName, type, eventType });
      res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getAllEvents = async (req, res) => {
    try {
      const events = await Event.findAll();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default EventController;
