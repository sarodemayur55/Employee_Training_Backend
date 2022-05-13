const mongoose = require("mongoose");

const webinarSchema = new mongoose.Schema({
  name: { type: String },
  url: { type: String },
  date_time: { type: Date },
 
});

module.exports = mongoose.model("webinar", webinarSchema);