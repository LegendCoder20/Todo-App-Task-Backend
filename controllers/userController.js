import UserModel from "../models/userSchema.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

export const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  const user = await UserModel.findOne({email});
  if (!user) {
    res.status(400);
    throw new Error("User Not Found");
  }

  res.status(200).json({
    success: true,
    message: "Logged in Successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});

export const registerUser = asyncHandler(async (req, res) => {
  const {name, email, password} = req.body;

  const userEmail = await UserModel.findOne({email});

  if (userEmail) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  const user = await UserModel.create({
    name: name,
    email: email,
    password: password,
  });

  res.status(201).json({
    message: "Registered Successfully",
    user: {
      name: name,
      email: email,
      password: password,
    },
  });
});
