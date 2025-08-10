import express from "express";
import {
  loginUser,
  registerUser,
  getUser,
  logOut,
} from "../controllers/userController.js";
import {protect} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", loginUser);
router.post("/register", registerUser);
router.get("/getUser", protect, getUser);
router.post("/logOut", protect, logOut);

export default router;
