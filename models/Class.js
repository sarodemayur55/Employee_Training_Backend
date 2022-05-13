const mongoose = require("mongoose");

const classSchema = new mongoose.Schema({
  name: { type: String },
  url: { type: String },
  date_time: { type: Date },
  course_id: { type: String },
});

module.exports = mongoose.model("classes", classSchema);
