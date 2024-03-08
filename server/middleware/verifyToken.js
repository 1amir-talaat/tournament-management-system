import jwt from "jsonwebtoken";
import { User, Admin } from "../models/models.js";

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized - Missing authorization header" });
  }

  const token = authHeader;

  try {
    const decodedToken = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    let user;
    if (decodedToken.isAdmin) {
      user = await Admin.findOne({
        where: { email: decodedToken.email },
        attributes: { exclude: ["password"] },
      });

      req.isAdmin = true;
      req.role = user.role;
    } else {
      user = await User.findOne({
        where: { email: decodedToken.email },
        attributes: { exclude: ["password"] },
      });

      req.isAdmin = false;
      req.role = "student";
    }

    if (!user) {
      return res.status(401).json({ error: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Unauthorized - Token expired" });
    } else {
      console.error("Error verifying token:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

export default verifyToken;
