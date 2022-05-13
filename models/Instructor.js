const mongoose = require("mongoose");

const instructorSchema = new mongoose.Schema({
  name: { type: String },
  password: { type: String },
  email: { type: String },
  image: { type: String },
  description:{type:String},
  designation:{type:String},
  role:{type:String,default:'instructor'},
});

module.exports = mongoose.model("instructors", instructorSchema);  
