import { Event, Participation, Questions } from "../models/models.js";

class EventController {
  static createEvent = async (req, res) => {
    if (!req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized - Admin access required" });
    }

    const { eventName, type, eventType, questions, answers } = req.body;

    try {
      const newEvent = await Event.create({ eventName, type, eventType });

      if (questions && answers) {
        await Promise.all(
          questions.map(async (question, index) => {
            const answer = answers[index];
            await Questions.create({
              eventId: newEvent.id,
              text: question ? question : "test",
              answer: answer ? answer : "test",
            });
          })
        );
      } else {
        return res.status(400).json({ error: "Questions and answers should be provided as arrays of equal length" });
      }

      res.status(201).json({ message: "Event created successfully", event: newEvent });
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getAllEvents = async (req, res) => {
    const userId = req.user.id;
    const isTeam = req.user.isTeam;

    try {
      let events = await Event.findAll({
        where: { type: isTeam ? "team" : "individual" },
        include: [
          {
            model: Participation,
            where: { userId: userId },
            required: false,
          },
          {
            model: Questions,
            attributes: ["id", "text"],
            required: true,
          },
        ],
      });

      events = events.filter((event) => event.Participations.length === 0);

      const eventsWithParticipantCount = await Promise.all(
        events.map(async (event) => {
          const participantCount = await Participation.count({
            where: { eventId: event.id },
          });

          return {
            id: event.id,
            name: event.eventName,
            type: event.type,
            eventType: event.eventType,
            numParticipations: participantCount,
            questions: event.questions,
          };
        })
      );

      res.json(eventsWithParticipantCount);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getAllEventsForAdmin = async (req, res) => {
    if (!req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized - Admin access required" });
    }

    try {
      let events = await Event.findAll({
        include: [
          {
            model: Participation,
            required: false,
          },
        ],
      });

      const eventsWithParticipantCount = await Promise.all(
        events.map(async (event) => {
          const participantCount = await Participation.count({
            where: { eventId: event.id },
          });

          return {
            id: event.id,
            name: event.eventName,
            type: event.type,
            eventType: event.eventType,
            numParticipations: participantCount,
            createdAt: event.createdAt,
          };
        })
      );

      res.json(eventsWithParticipantCount);
    } catch (error) {
      console.error("Error fetching events for admin:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getEventById = async (req, res) => {
    const eventId = req.params.eventId;

    try {
      const event = await Event.findByPk(eventId);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const participantCount = await Participation.count({
        where: { eventId: event.id },
      });

      const eventWithParticipantCount = {
        id: event.id,
        name: event.eventName,
        type: event.type,
        eventType: event.eventType,
        numParticipations: participantCount,
        questions: event.questions,
        createdAt: event.createdAt,
      };

      res.json(eventWithParticipantCount);
    } catch (error) {
      console.error("Error fetching event by ID:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static editEvent = async (req, res) => {
    if (!req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized - Admin access required" });
    }

    const eventId = req.params.eventId;
    const { eventName, type, eventType } = req.body;

    try {
      const event = await Event.findByPk(eventId);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      // Update the event properties
      event.eventName = eventName;
      event.type = type;
      event.eventType = eventType;
      await event.save();

      res.json({ message: "Event updated successfully", event });
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static deleteEvents = async (req, res) => {
    if (!req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized - Admin access required" });
    }

    const eventIds = req.body.ids

    try {
      // Delete each event by its ID
      await Promise.all(
        eventIds.map(async (eventId) => {
          const event = await Event.findByPk(eventId);
          if (event) {
            await event.destroy();
          }
        })
      );

      res.json({ message: "Events deleted successfully" });
    } catch (error) {
      console.error("Error deleting events:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default EventController;
