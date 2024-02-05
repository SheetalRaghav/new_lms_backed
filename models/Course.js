const mongoose = require("mongoose");
const { Schema } = mongoose;

let CourseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Approved", "Pending", "Rejected"],
    required: true,
  },
  data: [],
  categoryId: { type: Schema.Types.ObjectId, ref: "Category" },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Course", CourseSchema);
