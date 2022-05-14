const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: String,
  type: String,
  image: String,
});

module.exports = mongoose.model('Tag', tagSchema);