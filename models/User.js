const mongoose = require("mongoose");
let UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  blocked: {
    type: Boolean,
    required: true,
    default: false,
  },
  courses: {
    type: Array,
    default: [],
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("User", UserSchema);
