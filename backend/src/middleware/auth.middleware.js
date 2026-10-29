import jwt from "jsonwebtoken";
import Admin from "../model/admin.model.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is required",
      });
    }

    const token = authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin" || !decoded.id) {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
      });
    }

    // Confirm the account still exists and remains an admin.
    const admin = await Admin.findById(decoded.id)
      .select("_id role");

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin account is not authorized",
      });
    }

    req.user = {
      id: admin._id.toString(),
      role: admin.role,
    };

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};