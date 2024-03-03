 const roleMiddleware = (roles) => {
  return async (req, res, next) => {
    const currentUser = req.user;

    if (!currentUser || !roles.includes(currentUser.role_id)) {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  };
};

export default roleMiddleware;
