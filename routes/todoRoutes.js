import express from "express";
import {protect} from "../middlewares/authMiddleware.js";
import {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";

const router = express.Router();

router.get("/todos", protect, getAllTodos);
router.post("/createTodo", protect, createTodo);
router.put("/todo/:id", protect, updateTodo);
router.delete("/:id", protect, deleteTodo);

export default router;
