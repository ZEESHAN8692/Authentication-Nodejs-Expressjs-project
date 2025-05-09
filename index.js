import express from "express";
import { Database } from "./config/databse.js";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "./model/user.model.js";
import session from "express-session";
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

// session
app.use(
  session({
    secret: "secreat123",
    resave: false,
    saveUninitialized: false,
  })
);
// Routes
const checkLogin = (req, res, next) => {
  if (!req.session.sessionKey) {
    res.redirect("/login");
  } else {
    next();
  }
};
app.get("/", checkLogin, (req, res) => {
  res.render("home", { sessionKey: req.session.sessionKey });
});
app.get("/about", checkLogin, (req, res) => {
  res.render("about", { sessionKey: req.session.sessionKey });
});
app.get("/login", (req, res) => {
  if (req.session.sessionKey) {
    res.redirect("/");
  } else {
    res.render("login", { error: null });
  }
});
app.get("/signup", (req, res) => {
  if (req.session.sessionKey) {
    res.redirect("/");
  } else {
    res.render("signup");
  }
});

app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const ckekHash = await bcrypt.hash(password, 10);
  await User.create({ username: username, email: email, password: ckekHash });
  res.redirect("/login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.render("login", { error: "User Not Found " });
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.render("login", { error: "Invalid Password" });
  }
  req.session.sessionKey = user.username;
  res.redirect("/");
});

app.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/login");
  });
});
