import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authenticateMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Token not provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    const user = await User.findOne({
      where: { email : decodedToken.email},
      attributes: { exclude: ["password"] },
    });

    req.user = user;

    next();
  });
};

export default authenticateMiddleware;
