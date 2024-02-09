const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const logger = require("morgan");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const app = express();
require("dotenv").config();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(logger("common"));
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static("public"));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./router")(app);
require("./db/db");

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.status(200).send("LMS backend is running");
});

app.listen(PORT, () => {
  console.log("SERVER RUNNING ON PORT ", PORT);
});
