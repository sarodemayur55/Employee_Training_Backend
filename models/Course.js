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
    sessionsinfo:[
      {
        session_name:String,
        completed:{ type: Boolean, default: false},
        added:{ type: Boolean, default: false},
        date:{type:Date, default: null},
        description:{type:String, default:null},
        mode:{type:String, default:null},
        link:{type:String, default:null}, 
        venue:{type:String, default:null}
      }
    ]
  },
  feedback_questions:Array
});

module.exports = mongoose.model("courses", courseSchema);
