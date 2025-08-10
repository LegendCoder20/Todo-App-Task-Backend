import jwt from "jsonwebtoken";
import UserModel from "../models/userSchema.js";

export const protect = async (req, res, next) => {
  let token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      message: "Not Authorized",
    });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await UserModel.findById(decode.id).select("-password");

    return next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: "Not Authorized - Issue in Auth Middleware",
    });
  }
};
