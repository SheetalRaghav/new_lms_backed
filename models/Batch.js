const mongoose = require("mongoose");
const { Schema } = mongoose;

let BatchSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  courseId: { type: Schema.Types.ObjectId, ref: "Course" },
  student: [],
  date: {
    type: Date,
    default: Date.now,
  },
  courseDetails:{
    type: Object,
    required: true,
  }
});

module.exports = mongoose.model("Batch", BatchSchema);
