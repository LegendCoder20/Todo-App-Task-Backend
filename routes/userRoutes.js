import express from "express";
import {
  loginUser,
  registerUser,
  getUser,
} from "../controllers/userController.js";
import {protect} from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/", loginUser);
router.post("/register", registerUser);
router.get("/getUser", protect, getUser);

export default router;
