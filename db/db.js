const mongoose = require("mongoose");
require("dotenv").config();

async function connect() {
  const url = `mongodb+srv://lms123:webseeder123@lms.gxvukec.mongodb.net/?retryWrites=true&w=majority`;
  await mongoose.connect(url).then(() => {
    console.log("connected successfully");
  });
}
module.exports = connect;
