import { Participation, Event, User } from "../models/models.js";

class ParticipationController {
  static participateInEvent = async (req, res) => {
    const { userId, eventId } = req.body;

    if (!((userId) && eventId)) {
      return res.status(401).json({ error: "Missing input fields" });
    }

    if (userId) {
      if (userId != req.user.id) {
        return res.status(403).json({ error: "Unauthorized - You are not authorized to perform this action" });
      }
    } else {
      const users = await User.findAll({ where: { currentTeamId: teamId } });
      const foundUser = users.find((user) => user.id === req.user.id);
      if (!foundUser) {
        return res.status(403).json({ error: "Unauthorized - You are not authorized to perform this action" });
      }
    }

    try {
      const event = await Event.findByPk(eventId);

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      if (teamId) {
        if (event.type != "Team") {
          return res.status(400).json({ error: "Event type is Individual" });
        }
        const team = await Team.findByPk(teamId);
        if (!team) {
          return res.status(404).json({ error: "Team not found" });
        }

        const existingParticipation = await Participation.findOne({
          where: { eventId, teamId },
        });

        if (existingParticipation) {
          return res.status(400).json({ error: "User already participating in this event with this team" });
        }

        const newParticipation = await Participation.create({ userId, eventId, teamId });
        res.status(201).json({ message: "User registered for event as part of team", participation: newParticipation });
      } else {
        if (event.type != "Individual") {
          return res.status(400).json({ error: "Event type is Team" });
        }

        const user = await User.findByPk(userId);

        if (!user) {
          return res.status(404).json({ error: "user not found" });
        }

        const existingParticipation = await Participation.findOne({
          where: { userId, eventId },
        });

        if (existingParticipation) {
          return res.status(400).json({ error: "User already participating in this event" });
        }

        const newParticipation = await Participation.create({ userId, eventId, teamId });
        res.status(201).json({ message: "User registered for event successfully", participation: newParticipation });
      }
    } catch (error) {
      console.error("Error registering user for event:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getParticipations = async (req, res) => {
    const { userId, teamId } = req.body;

    if (!userId || !teamId) {
      return res.status(404).json({ error: "User or event not found" });
    }

    try {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Event,
            through: { attributes: [] },
          },
          {
            model: Team,
            through: { attributes: [] },
            include: {
              model: Event,
              through: { attributes: [] },
            },
          },
        ],
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const participations = [];

      user.Events.forEach((participation) => {
        participations.push({
          participationType: "individual",
          event: participation,
        });
      });

      user.Teams.forEach((team) => {
        team.Events.forEach((event) => {
          participations.push({
            participationType: "team",
            team: team,
            event: event,
          });
        });
      });

      res.json(participations);
    } catch (error) {
      console.error("Error fetching user participations:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getUserEventCount = async (req, res) => {
    const { userId, teamId } = req.body;

    if (!userId && !teamId) {
      return res.status(404).json({ error: "User or team ID not provided" });
    }

    try {
      let whereClause = {};
      if (userId) {
        whereClause = { userId };
      } else {
        whereClause = { teamId };
      }

      const count = await Participation.count({ where: whereClause });

      const response = {
        message: "event count retrieved successfully",
        count,
        userId: userId ? userId : null,
        teamId: teamId ? teamId : null,
      };

      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching user event counts:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getEventParticipants = async (req, res) => {
    const { eventId } = req.params;

    try {
      const event = await Event.findByPk(eventId, {
        include: [
          {
            model: User,
            through: { attributes: [] },
          },
        ],
      });

      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }

      const participants = event.Users;

      res.json(participants);
    } catch (error) {
      console.error("Error fetching event participants:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default ParticipationController;
