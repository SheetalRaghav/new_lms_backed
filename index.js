const express = require("express");
const app = express();
var cors = require("cors");
require("dotenv").config();
app.use(cors());
const bodyParser = require("body-parser");
const connect = require("./db/db");
app.use(bodyParser.json());
connect();
app.use("/auth", require("./routes/auth"));
app.use("/category", require("./routes/category"));
app.get("/", (req, res) => {
  res.send("Hey everyone!");
});
app.listen(5000, () => {
  console.log("Listening on port 5000");
});
