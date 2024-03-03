import { Team } from "../models/index.js";

class TeamController {
  static getAllTeams = async (req, res) => {
    try {
      const teams = await Team.findAll();
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getTeamById = async (req, res) => {
    const { id } = req.params;
    try {
      const team = await Team.findByPk(id);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };

  static createTeam = async (req, res) => {
    const { name } = req.body;

    if (!name) {
      return res.status(401).json({ error: "Missing team name" });
    }

    try {
      const team = await Team.create({ name });
      res.status(201).json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static updateTeam = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    try {
      const team = await Team.findByPk(id);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      await team.update({ name });
      res.json(team);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };

  static deleteTeam = async (req, res) => {
    const { id } = req.params;
    try {
      const team = await Team.findByPk(id);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      await team.destroy();
      res.json({ message: "Team deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };
}

export default TeamController;
