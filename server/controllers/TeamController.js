import { Op } from "sequelize";
import { Team, User } from "../models/models.js";

class TeamController {
  static createTeam = async (req, res) => {
    const { teamName, memberEmails } = req.body;

    if (memberEmails.length !== 4) {
      return res.status(400).json({ error: "Team must have exactly 4 members" });
    }

    try {
      const existingUsers = await User.findAll({
        where: {
          email: {
            [Op.in]: memberEmails,
          },
          inTeam: true,
        },
      });

      if (existingUsers.length > 0) {
        return res.status(400).json({ error: "Some members are already in a team" });
      }

      const newTeam = await Team.create({ teamName });

      const users = await User.findAll({
        where: {
          email: {
            [Op.in]: memberEmails,
          },
        },
      });

      await Promise.all(
        users.map(async (user) => {
          user.inTeam = true;
          user.currentTeamId = newTeam.id;
          await user.save();
        })
      );

      res.status(201).json({ message: "Team created successfully", team: newTeam });
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getAllTeams = async (req, res) => {
    if (!req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized - Admin access required" });
    }

    try {
      const teams = await Team.findAll({
        include: {
          model: User,
          as: "Users", 
          attributes: { exclude: ["password"] },
        },
      });

      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static deleteTeam = async (req, res) => {
    const { teamId } = req.params;

    if (!req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized - Admin access required" });
    }

    try {
      const team = await Team.findByPk(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }

      await team.destroy();
      res.json({ message: "Team deleted successfully" });
    } catch (error) {
      console.error("Error deleting team:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getTeamByUserId = async (req, res) => {
    const user = req.user;

    try {
      if (!user || !user.currentTeam) {
        return res.status(404).json({ error: "User is not part of any team" });
      }

      const teamId = user.currentTeam.id;
      return res.json({ teamId });
    } catch (error) {
      console.error("Error fetching team by user ID:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default TeamController;
