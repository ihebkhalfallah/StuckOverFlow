import jwt from "jsonwebtoken";
import User from "../modules/user.js";

export const authorize = (roles = []) => {
  if (typeof roles === "string") {
    roles = [roles];
  }

  return async (req, res, next) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decodedToken.userId);
      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      }

      req.user = user;
      next();
    } catch (error) {
      return res
        .status(401)
        .json({ message: "Unauthorized", error: error.message });
    }
  };
};

export const checkAccountApproval = (req, res, next) => {
  if (!req.user || !req.user.isApproved) {
    return res
      .status(401)
      .json({ message: "Your account is not approved yet" });
  }
  next();
};
export default authorize;
