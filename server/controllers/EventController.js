import { Event } from "../models/index.js";

class EventController {
  static getAllEvents = async (req, res) => {
    try {
      const events = await Event.findAll();
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getEventById = async (req, res) => {
    const { id } = req.params;
    try {
      const event = await Event.findByPk(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };

  static createEvent = async (req, res) => {
    const { name, type, participation_type } = req.body;

    if (!(name && type && participation_type)) {
      return res.status(401).json({ error: "Missing input fields" });
    }

    try {
      const event = await Event.create({ name, type, participation_type });
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static updateEvent = async (req, res) => {
    const { id } = req.params;
    const { name, type, participation_type } = req.body;
    try {
      const event = await Event.findByPk(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      await event.update({ name, type, participation_type });
      res.json(event);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };

  static deleteEvent = async (req, res) => {
    const { id } = req.params;
    try {
      const event = await Event.findByPk(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      await event.destroy();
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };
}

export default EventController;
