const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String,unique: false},
  password: { type: String },
  profile_image: { type: String },
  role: { type: String,default:'employee' },
  phone: { type: Number },
});

module.exports = mongoose.model("users", userSchema);  
