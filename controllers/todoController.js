import asyncHandler from "express-async-handler";
import TodoModel from "../models/todoSchema.js";

// GET ALL TODOS of USER
export const getAllTodos = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const todos = await TodoModel.find({user: userId});

  res.status(200).json({
    message: "All Todos Fetched",
    todos: todos,
  });
});

// GET TODO DETAIL
export const getTodoDetail = asyncHandler(async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user.id;

  const todo = await TodoModel.findOne({_id: todoId, user: userId});

  if (!todo) {
    throw new Error("Todo not Found");
  }

  res.status(200).json({
    message: "Todo Detail Fetched",
    todo: todo,
  });
});

// CREATE TODO
export const createTodo = asyncHandler(async (req, res) => {
  const {title, description} = req.body;
  const userId = req.user.id;

  if (!title || !description) {
    res.status(400);
    throw new Error("Some Fields are Missing");
  }

  const newTodo = await TodoModel.create({
    title,
    description,
    user: userId,
  });

  res.status(201).json({
    message: "Todo Created Successfully",
    todo: newTodo,
  });
});

// UPDATE TODO
export const updateTodo = asyncHandler(async (req, res) => {
  const {title, description} = req.body;
  const todoId = req.params.id;
  const userId = req.user.id;

  if (!title || !description) {
    res.status(400);
    throw new Error("Some Fields are Missing");
  }

  const updatedTodo = await TodoModel.findOneAndUpdate(
    {_id: todoId, user: userId},
    {
      title,
      description,
    },
    {new: true}
  );

  if (!updatedTodo) {
    res.status(404);
    throw new Error("Todo Not Found");
  }

  res.status(200).json({
    message: "Todo Updated",
    todo: updatedTodo,
  });
});

// DELETE TODO LOGIC
export const deleteTodo = asyncHandler(async (req, res) => {
  const todoId = req.params.id;
  const userId = req.user.id;

  const deletedTodo = await TodoModel.findOneAndDelete({
    _id: todoId,
    user: userId,
  });

  if (!deletedTodo) {
    res.status(404);
    throw new Error("Todo Doesn't Exist");
  }

  const updatedTodos = await TodoModel.find({user: userId});

  res.status(200).json({
    message: "Todo Deleted Successfully",
    todos: updatedTodos,
  });
});
