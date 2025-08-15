import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDatabase from "./db.js";
import errorHandler from "./middlewares/errorHandlerMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

dotenv.config();

const app = express();

connectDatabase();

app.use(express.json());
// JSON PARSER ERROR HANDLER MIDDLEWARE
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      message: "Invalid JSON",
      error: err.message,
    });
  }
  next(err);
});
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "https://todo-app-task-frontend.onrender.com",
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use("/api", userRoutes);
app.use("/api", todoRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on PORT http://localhost:${PORT}`);
});
