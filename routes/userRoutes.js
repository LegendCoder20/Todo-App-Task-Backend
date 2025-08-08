import express from "express";
import {loginUser, registerUser} from "../controllers/userController.js";
const router = express.Router();

router.post("/", loginUser);
router.post("/register", registerUser);
// router.get("/getUser", getUser);

export default router;
