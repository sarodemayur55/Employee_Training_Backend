const mongoose = require("mongoose");

const userdataSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  email: { type: String, unique: true },
  phone: { type: Number },
});

module.exports = mongoose.model("userdata", userdataSchema);  
