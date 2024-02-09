const mongoose = require("mongoose");

const { UserSchema } = require("./schema/userSchema");
const { CourseSchema } = require("./schema/courseSchema");
const { CategorySchema } = require("./schema/categorySchema");

const connectionUri = `mongodb+srv://lms123:webseeder123@lms.gxvukec.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(connectionUri, {
  useUnifiedTopology: true,
  autoIndex: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB successfully");
});

// Model definitions
const userModel = mongoose.model("Users", UserSchema);
const courseModel = mongoose.model("Course", CourseSchema);
const categoryModel = mongoose.model("Category", CategorySchema);

module.exports = {
  db,
  userModel,
  courseModel,
  categoryModel,
};
