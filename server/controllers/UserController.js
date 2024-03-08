import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, Team, Admin } from "../models/models.js";

class UserController {
  static getAllUsers = async (req, res) => {
    if (!req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized - Admin access required" });
    }

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
    if (!req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized - Admin access required" });
    }

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
    const { name, email, password } = req.body;

    if (!(name && email && password)) {
      return res.status(401).json({ error: "Missing input fields" });
    }

    try {
      const newUser = await User.create({ name, email, password: await bcrypt.hash(password, 10), inTeam: false, currentTeamId: null });

      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          isAdmin: false,
          role: "student",
          inTeam: newUser.inTeam,
          currentTeamId: newUser.currentTeamId,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );

      res.status(200).json({
        token,
        msg: "Registration Successful",
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

    let isAdmin = false;
    let role = "student";

    try {
      let user = await User.findOne({
        where: { email },
      });

      if (!user) {
        user = await Admin.findOne({ where: { email } });
        isAdmin = true;
        role = user.role;
      }

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }

      const matchedPassword = await bcrypt.compare(password, user.password);

      if (!matchedPassword) {
        return res.status(401).json({ error: "Incorrect email or password" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin,
          role,
          inTeam: user.inTeam,
          currentTeamId: user.currentTeamId,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );

      res.status(200).json({
        token,
        msg: "Login Successful",
      });
    } catch (error) {
      console.error("Error during Login:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static deleteUser = async (req, res) => {
    const { id } = req.params;

    if (!req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized - Admin access required" });
    }

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

  static createAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    if (!(name && email && password)) {
      return res.status(401).json({ error: "Missing input fields" });
    }

    if (!req.isAdmin || req.role !== "superadmin") {
      return res.status(403).json({ error: "Unauthorized - Only super admins can create new admins" });
    }

    try {
      const existingAdmin = await Admin.findOne({ where: { email } });
      if (existingAdmin) {
        return res.status(400).json({ error: "Email address already exists" });
      }

      const newAdmin = await Admin.create({ name, email, role: "admin", password: await bcrypt.hash(password, 10) });

      const token = jwt.sign(
        {
          id: newAdmin.id,
          email: newAdmin.email,
          name: newAdmin.name,
          isAdmin: true,
          role: newAdmin.role,
          inTeam: newAdmin.inTeam,
          currentTeamId: newAdmin.currentTeamId,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );
      
      res.status(201).json({
        token,
        msg: "Admin created successfully",
      });
    } catch (error) {
      console.error("Error creating admin user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default UserController;
