const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  course_name:{
    type:String
  },
  ispretest:{
    type:Boolean
  },
  isposttest:{
    type:Boolean
  },
  mode:{
    type:String
  },
  elearning:{
    sessionsinfo:Array
  },
  virtual:{
    sessionsinfo:Array
  },
  feedback_questions:Array
});

module.exports = mongoose.model("courses", courseSchema);
