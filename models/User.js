const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    login: String,
    password: String,
  },
  { collection: "users" }
);

module.exports = mongoose.model("User", userSchema);
