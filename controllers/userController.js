import UserModel from "../models/userSchema.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// LOGIN USER LOGIC

export const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  const user = await UserModel.findOne({email});

  if (!user) {
    res.status(400);
    throw new Error("User Not Found");
  }

  let passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(400);
    throw new Error("Passwords Didn't Match");
  }

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {expiresIn: "30d"}
  );

  res.status(200).json({
    success: true,
    message: "Logged in Successfully",
    user: {
      name: user.name,
      email: user.email,
    },
    token: token,
  });
});

// REGISTER USER LOGIC

export const registerUser = asyncHandler(async (req, res) => {
  const {name, email, password} = req.body;

  const userEmail = await UserModel.findOne({email});

  if (userEmail) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  let saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await UserModel.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {expiresIn: "30d"}
  );

  res.status(201).json({
    message: "Registered Successfully",
    user: {
      name: name,
      email: email,
    },
    token: token,
  });
});

// GET USER LOGIC

export const getUser = asyncHandler(async (req, res) => {
  const user = req.user;

  res.status(200).json({
    message: "Logged in Successfully",
    name: user.name,
    email: user.email,
  });
});
