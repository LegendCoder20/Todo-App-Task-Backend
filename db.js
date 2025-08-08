import chalk from "chalk";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

let MONGO_URI = process.env.DB_URL;

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(`${MONGO_URI}/todo`);
    console.log(chalk.cyan(`MongoDB Connected ${conn.connection.host}`));
  } catch (err) {
    console.error(`Error Connecting to the Database ${err.message}`);
    process.exit(1);
  }
};

export default connectDatabase;
