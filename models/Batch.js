const mongoose = require("mongoose");

const batchschema = new mongoose.Schema({
    batch_name:{
        type:String
    },
    course_id:{
      type:String
    },
    trainer_id:{
        type:String
    },
  employee_id:{
    type:Array
  },
  meets:{
    type:Array
  }
});

module.exports = mongoose.model("batches", batchschema);  
