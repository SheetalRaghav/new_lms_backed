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
  categoryId: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
});

module.exports = mongoose.model("Course", CourseSchema);
