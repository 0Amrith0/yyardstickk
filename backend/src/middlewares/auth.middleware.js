import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import User from "../models/User.model.js";
import Tenant from "../models/Tenant.model.js";

dotenv.config();

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.jwt || req.headers.authorization?.split(" ")[1];
    if (!token){
            return res.status(401).json({message : "Unauthorized - No token provided"});
        }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    
    const user = await User.findById(payload.userId);
    if (!user) {
        return res.status(401).json({ error: "User not found" })
    };

    const tenant = await Tenant.findById(user.tenantId);
    if (!tenant) {
        return res.status(401).json({ error: "Tenant not found" })
    };

    
    req.user = {
      _id: user._id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId
    };
    
    req.tenant = {
      _id: tenant._id,
      tenantName: tenant.tenantName,
      plan: tenant.plan,
      notesCount: tenant.notesCount
    };

    next();

  } catch (err) {
    console.error("authMiddleware error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};


export const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  if (req.user.role !== role) return res.status(403).json({ error: "Access Denied - Admin Only" });
  next();
};