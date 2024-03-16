import { Participation, Event, User, Questions } from "../models/models.js";

class ParticipationController {
  static participateInEvent = async (req, res) => {
    const { eventId, answers } = req.body;
    const user = req.user;

    if (!eventId || !answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "Invalid input fields" });
    }

    try {
      const event = await Event.findByPk(eventId);

      if (!event || !user) {
        return res.status(404).json({ error: "Event or user not found" });
      }

      let totalPoints = 0;
      for (const { id, answer } of answers) {
        const question = await Questions.findByPk(id);
        if (!question) {
          return res.status(404).json({ error: `Question with ID ${id} not found` });
        }
        if (answer === question.answer) {
          totalPoints += 5;
        }
      }

      const newParticipation = await Participation.create({ userId: user.id, eventId, points: totalPoints });

      const updatedPoints = user.points + totalPoints;
      await user.update({ points: updatedPoints });

      res.status(201).json({ message: "User registered for event successfully", participation: newParticipation });
    } catch (error) {
      console.error("Error registering user for event:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

}

export default ParticipationController;
