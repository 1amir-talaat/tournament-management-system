import { TeamParticipant } from "../models/index.js";

class TeamParticipantController {
  static getTeamParticipantsByEvent = async (req, res) => {
    const { eventId } = req.params;
    try {
      const teamParticipants = await TeamParticipant.findAll({ where: { event_id: eventId } });
      res.json(teamParticipants);
    } catch (error) {
      console.error("Error fetching team participants by event:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static createTeamParticipant = async (req, res) => {
    const { team_id, event_id } = req.body;

    if (!(team_id && event_id)) {
      return res.status(401).json({ error: "Missing input fields" });
    }

    try {
      const teamParticipant = await TeamParticipant.create({ team_id, event_id });
      res.status(201).json(teamParticipant);
    } catch (error) {
      console.error("Error creating team participant:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default TeamParticipantController;
