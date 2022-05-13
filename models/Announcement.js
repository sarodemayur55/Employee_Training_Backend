const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  description: { type: String },
  date: { type: Date },
  course_id: { type: String },
});

module.exports = mongoose.model("announcements", announcementSchema);
 