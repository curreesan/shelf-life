import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    const { _id, householdId, createdAt, updatedAt } = user.toObject();
    const userSafe = { _id, name, email, householdId, createdAt, updatedAt };

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({ token, user: userSafe });
  } catch (err) {
    console.error(`Register Error : ${err}`);
    if (err.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    res.status(400).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const { _id, name, householdId, createdAt, updatedAt } = user.toObject();
    const userSafe = { _id, name, email, householdId, createdAt, updatedAt };

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(200).json({ token, user: userSafe });
  } catch (err) {
    console.log(`Login Error: ${err}`);
    res.status(400).json({ message: `Login Error : ${err}` });
  }
};
