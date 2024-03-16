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
}

export default EventController;
