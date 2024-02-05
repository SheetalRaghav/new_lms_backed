const mongoose = require("mongoose");
let CategorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date:{
    type:Date, 
    default: Date.now,
  }
});

module.exports = mongoose.model("Category", CategorySchema);
