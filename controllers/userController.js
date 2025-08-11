import UserModel from "../models/userSchema.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import {UserLogin, UserRegister} from "../validation/userValidation.js";

// LOGIN USER LOGIC
export const loginUser = asyncHandler(async (req, res) => {
  const {email, password} = req.body;

  const userValidation = UserLogin.safeParse({email, password});

  if (!userValidation.success) {
    const errorMessages = userValidation.error.issues.map(
      (err) => `${err.message}`
    );

    res.status(400);
    throw new Error(`${errorMessages.join(", ")}`);
  }

  const user = await UserModel.findOne({email});

  if (!user) {
    res.status(400);
    throw new Error("User Not Found");
  }

  let passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(400);
    throw new Error("Incorrect Password");
  }

  const token = jwt.sign(
    {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {expiresIn: "7d"}
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(200).json({
    message: "Logged in Successfully",
    user: {
      name: user.name,
      email: user.email,
    },
  });
});

// REGISTER USER LOGIC
export const registerUser = asyncHandler(async (req, res) => {
  const {name, email, password} = req.body;

  const userValidation = UserRegister.safeParse({name, email, password});

  if (!userValidation.success) {
    const errorMessages = userValidation.error.issues.map(
      (err) => `${err.message}`
    );

    res.status(400);
    throw new Error(`${errorMessages}`);
  }

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
    {expiresIn: "7d"}
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  res.status(201).json({
    message: "Registered Successfully",
    user: {
      name: name,
      email: email,
    },
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

// USER LOGOUT  LOGIC

export const logOut = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production" ? true : false,
    sameSite: "none",
    expires: new Date(0),
    path: "/",
  });

  res.status(200).json({
    message: "Logged Out Successfully",
  });
});
