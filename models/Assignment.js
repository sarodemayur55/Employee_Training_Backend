const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  name: { type: String },
  description: { type: String },
  due_date: { type: Date},
  marks: {type: Number},
  course_id: { type: String },
  link : { type: String }
});

module.exports = mongoose.model("assignments", assignmentSchema);


// "name":  "" ,
// "description": "",
// "due_date": "",
// "course_id": ""



