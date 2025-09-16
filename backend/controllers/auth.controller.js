import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateToken } from "../lib/generateToken.js";


import User from "../models/User.model.js";
import Tenant from "../models/Tenant.model.js";


export const getMe = async (req, res) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.userId).populate("tenantId");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId._id
      },
      tenant: {
        _id: user.tenantId._id,
        tenantName: user.tenantId.tenantName.charAt(0).toUpperCase() + user.tenantId.tenantName.slice(1),
        plan: user.tenantId.plan,
      },
    });
  } catch (error) {
    console.error("Error in getMe controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password ) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const tenantName = email.split("@")[1].split(".")[0];

    let tenant = await Tenant.findOne({ tenantName });
    if (!tenant) {
      tenant = await Tenant.create({
        tenantName: tenantName,
        plan: "free",
        notesCount: 0,
      });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = await User.create({
      email,
      password: hashedPassword,
      role: "Member",
      tenantId: tenant._id,
    });

    
    generateToken(
      { userId: newUser._id.toString(), 
        role: newUser.role, 
        tenantId: tenant._id.toString() 
      }, res);


    return res.status(201).json({
      message: "Signup successful",
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      },
      tenant: {
        tenantName: tenant.tenantName.charAt(0).toUpperCase() + tenantName.slice(1),
        plan: tenant.plan,
      },
    });
  } catch (error) {
    console.error("Error in signup controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).populate("tenantId");
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password || "");
    if (!isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    generateToken(
      { userId: user._id.toString(), 
        role: user.role, 
        tenantId: user.tenantId._id.toString() 
      }, res);


    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      tenant: {
        tenantName: user.tenantId.tenantName.charAt(0).toUpperCase() + user.tenantId.tenantName.slice(1),
        plan: user.tenantId.plan,
      }

    });
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
