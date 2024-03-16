import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User, Admin } from "../models/models.js";

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
    const { name, email, password, isTeam } = req.body;

    if (!(name && email && password)) {
      return res.status(401).json({ error: "Missing input fields" });
    }

    try {
      const newUser = await User.create({ name, email, password: await bcrypt.hash(password, 10), isTeam });

      const token = jwt.sign(
        {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          isAdmin: false,
          role: "student",
          points: newUser.points,
          isTeam: newUser.isTeam,
          maxEvents: null,
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

        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        isAdmin = true;
        role = user.role;
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
          points: user.points,
          isTeam: user.isTeam,
          maxEvents: user.maxEvents,
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

  static editUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    if (!req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized - Admin access required" });
    }

    try {
      let user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (name) user.name = name;
      if (email) user.email = email;

      await user.save();

      res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static deleteUsers = async (req, res) => {
    const { ids } = req.body;

    if (!req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized - Admin access required" });
    }

    try {
      for (const id of ids) {
        const user = await User.findByPk(id);
        if (!user) {
          return res.status(404).json({ error: `User with ID ${id} not found` });
        }

        await user.destroy();
      }

      res.status(200).json({ msg: "Users deleted successfully" });
    } catch (error) {
      console.error("Error deleting users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getAllAdmins = async (req, res) => {
    if (!req.isAdmin && req.role != "superadmin") {
      return res.status(403).json({ error: "Unauthorized - Super Admin access required" });
    }

    try {
      const admins = await Admin.findAll();
      res.json(admins);
    } catch (error) {
      console.error("Error fetching admins:", error);
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

  static editAdmin = async (req, res) => {
    if (!req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized - Admin access required" });
    }
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    try {
      const admin = await Admin.findByPk(id);
      if (!admin) {
        return res.status(404).json({ error: "Admin not found" });
      }

      admin.name = name;
      admin.email = email;

      await admin.save();

      res.json(admin);
    } catch (error) {
      console.error("Error editing admin:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static deleteAdmins = async (req, res) => {
    if (!req.isAdmin) {
      return res.status(403).json({ error: "Unauthorized - Admin access required" });
    }

    const { ids } = req.body;

    try {
      for (const id of ids) {
        const admin = await Admin.findByPk(id);
        if (!admin) {
          return res.status(404).json({ error: `Admin with ID ${id} not found` });
        }

        await admin.destroy();
      }

      res.status(200).json({ msg: "Admins deleted successfully" });
    } catch (error) {
      console.error("Error deleting admins:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getAdminById = async (req, res) => {
    const { id } = req.params;

    try {
      const admin = await Admin.findByPk(id);
      if (!admin) {
        return res.status(404).json({ message: "Admin not found" });
      }

      res.json(admin);
    } catch (error) {
      console.error("Error fetching admin:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static changeMaxEvents = async (req, res) => {
    const { id, maxEvents } = req.body;

    try {
      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.maxEvents = maxEvents;

      await user.save();

      res.status(200).json({ message: "student data updated successfully" });
    } catch (error) {
      console.error("Error updating max events:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static refreshUserToken = async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      const { id, email, name, isAdmin, role, isTeam, maxEvents } = decoded;

      const updatedUser = await User.findByPk(id);

      const newToken = jwt.sign(
        {
          id: updatedUser.id,
          email: updatedUser.email,
          name: updatedUser.name,
          isAdmin,
          role,
          points: updatedUser.points,
          isTeam: updatedUser.isTeam,
          maxEvents: updatedUser.maxEvents,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "30d",
        }
      );

      res.status(200).json({
        token: newToken,
        msg: "Token refreshed successfully",
      });
    } catch (error) {
      console.error("Error refreshing token:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  static getTopUsers = async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password", "email"] },
        order: [["points", "DESC"]],
      });
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
}

export default UserController;
