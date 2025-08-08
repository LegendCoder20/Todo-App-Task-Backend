import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDatabase from "./db.js";
import errorHandler from "./middlewares/errorHandlerMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import todoRoutes from "./routes/todoRoutes.js";

dotenv.config();

const app = express();

connectDatabase();

app.use(express.json());
app.use(cors());

app.use("/api", userRoutes);
app.use("/api", todoRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on PORT http://localhost:${PORT}`);
});
