const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: String,
  description: String,
  tagsIds: [String],
  githubUrl: String,
  projectUrl: String,
  videoUrl: String,
  images: [String]
})

module.exports = mongoose.model("Project", projectSchema);