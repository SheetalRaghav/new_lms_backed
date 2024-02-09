//map routes here
const userRouter = require("./routes/user");
const courseRouter = require("./routes/course");
const categoryRouter = require("./routes/category");

module.exports = function (app) {
  app.use("/auth", userRouter);
  app.use("/course", courseRouter);
  app.use("/category", categoryRouter);
};
