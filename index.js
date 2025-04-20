import express from "express";
import { Database } from "./config/databse.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();

//midleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Successfull connected Port http://localhost:${PORT}/`);
});

//Database
Database();

// Routes

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});
