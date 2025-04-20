import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

export const Database = async () => {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("Database Conneted");
    })
    .catch(() => {
      console.log("Database Not Connet");
    });
};

