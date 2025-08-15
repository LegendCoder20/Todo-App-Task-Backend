import asyncHandler from "express-async-handler";
import TodoModel from "../models/todoSchema.js";
import {Todo} from "../validation/todoValidation.js";

// GET ALL TODOS of USER
export const getAllTodos = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const todos = await TodoModel.find({user: userId}).populate(
    "user",
    "name email"
  );

  const limit = parseInt(req.query.limit) || 10;
  const cursor = req.query.cursor;

  const query = cursor ? {_id: {$gt: cursor}} : {};
  const allTodos = await TodoModel.find(query)
    .sort({_id: 1})
    .limit(limit + 1);

  let nextCursor = null;
  let hasMore = false;

  if (allTodos.length > limit) {
    hasMore = true;
    nextCursor = allTodos[limit - 1]._id;
    allTodos.length = limit;
  }

  res.status(200).json({
    message: "Todos Fetched",
    todos: allTodos,
    nextCursor: nextCursor,
    hasMore: hasMore,
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
  const todoValidation = Todo.safeParse({title, description});

  if (!todoValidation.success) {
    const errorMessages = todoValidation.error.issues.map(
      (err) => `${err.message}`
    );

    res.status(400);
    throw new Error(` ${errorMessages.join(",")}`);
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

  const todoValidation = Todo.safeParse({title, description});

  if (!todoValidation.success) {
    const errorMessages = todoValidation.error.issues.map(
      (err) => `${err.message}`
    );

    res.status(400);
    throw new Error(` ${errorMessages.join(",")}`);
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
