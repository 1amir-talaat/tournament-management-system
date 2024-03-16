import { Event, Participation, User } from "../models/models.js";

const checkEventParticipation = async (req, res, next) => {
  const { eventId } = req.body;
  const userId = req.user.id;

  try {
    const event = await Event.findByPk(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Check if the user is already participating in the maximum allowed number of events
    const user = await User.findByPk(userId);
    const userParticipations = await Participation.findAll({
      where: { userId },
    });

    if (userParticipations.length >= user.maxEvents) {
      return res.status(400).json({ error: "You has reached the maximum allowed number of participations" });
    }

    // Check if the user is already participating in the event
    const existingParticipation = await Participation.findOne({
      where: { userId, eventId },
    });

    if (existingParticipation) {
      return res.status(400).json({ error: "You already participating in this event" });
    }

    // If the event type is "individual", check if the user is already participating in any individual event
    if (event.type === "individual") {
      const individualParticipation = await Participation.findOne({
        where: { userId, eventId: { $ne: eventId } }, // Exclude the current event
      });

      if (individualParticipation) {
        return res.status(400).json({ error: "You already participating in another individual event" });
      }
    }

    // If the event type is "team", check if the user is part of a team already participating in any team event
    if (event.type === "team") {
      const userTeams = await User.findByPk(userId, { include: "teams" });

      for (const team of userTeams.teams) {
        const teamParticipation = await Participation.findOne({
          where: { teamId: team.id, eventId: { $ne: eventId } }, // Exclude the current event
        });

        if (teamParticipation) {
          return res.status(400).json({ error: "You team already participating in another team event" });
        }
      }
    }

    next(); // Call the next middleware in the chain
  } catch (error) {
    console.error("Error checking event participation:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default checkEventParticipation;
