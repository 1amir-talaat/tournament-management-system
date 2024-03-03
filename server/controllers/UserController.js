import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import Team from "../models/team.js";

class UserController {
  static getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll({ attributes: { exclude: ["password"] } });
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getUserById = async (req, res) => {
    const { id } = req.params;
    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  };

  static register = async (req, res) => {
    const { full_name, email, password, isTeam, teamName, teamMembers } = req.body;

    if (!(full_name && email && password)) {
      return res.status(401).json({ error: "Missing input fields" });
    }

    try {
      let newUser;

      if (isTeam) {
        if (!teamName) {
          return res.status(401).json({ error: "Team name is required" });
        }
        const team = await Team.create({ name: teamName, is_team: true });

        newUser = await User.create({ full_name, email, role_id: 1, password: await bcrypt.hash(password, 10), team_id: team.id });

        for (const memberEmail of teamMembers) {
          const member = await User.findOne({ where: { email: memberEmail }, include: Team });
          if (member) {
            await T
            await member.update({ team_id: team.id });
          } else {
            return res.status(404).json({ error: `User with email ${memberEmail} not found` });
          }
        }
      } else {
        if (!teamName) {
          return res.status(401).json({ error: "Team name is required" });
        }
        const team = await Team.create({ name: teamName, is_team: false });
        newUser = await User.create({ full_name, email, role_id: 1, password: await bcrypt.hash(password, 10), team_id: team.id });
      }

      const token = jwt.sign({ userId: newUser.id, email: newUser.email }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });

      res.status(200).json({
        token,
        msg: "Registration Successful",
        user: {
          id: newUser.id,
          full_name: newUser.full_name,
          role_id: newUser.role_id,
          email: newUser.email,
        },
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ error: "Email address already exists" });
      } else {
        console.error("Error creating admin user:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };

  static login = async (req, res) => {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(401).json({ error: "Missing input fields" });
    }

    try {
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const matchedPassword = await bcrypt.compare(password, user.password);

      if (!matchedPassword) {
        return res.status(401).json({ error: "Login Failed" });
      }

      const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });

      res.status(200).json({
        token,
        msg: "Login Successful",
        user: {
          id: user.id,
          full_name: user.full_name,
          role_id: user.role_id,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Error during Login:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static addAdmin = async (req, res) => {
    const { full_name, email, password } = req.body;

    if (!(full_name && email && password)) {
      return res.status(401).json({ error: "Missing input fields" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newAdminUser = await User.create({ full_name, email, role_id: 2, password: hashedPassword });

      const token = jwt.sign({ userId: newAdminUser.id, email: newAdminUser.email }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });

      res.status(200).json({
        token,
        msg: "Admin user created successfully",
        adminUser: {
          id: newAdminUser.id,
          full_name: newAdminUser.full_name,
          email: newAdminUser.email,
          role_id: newAdminUser.role_id,
        },
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({ error: "Email address already exists" });
      } else {
        console.error("Error creating admin user:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };

  static updateUser = async (req, res) => {
    const { id } = req.params;
    const { full_name, email, password } = req.body;

    if (!(full_name && email && password)) {
      return res.status(401).json({ error: "Missing input fields" });
    }

    try {
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.update({ full_name, email, password: await bcrypt.hash(password, 10) });

      res.status(200).json({ msg: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findByPk(id, { include: Team });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (user.team) {
        await user.team.destroy();
      }

      await user.destroy();

      res.status(200).json({ msg: "User and associated team deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default UserController;
