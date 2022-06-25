const mongoose = require("mongoose");

const batchschema = new mongoose.Schema({
    batch_name:{
        type:String
    },
    course_id:{
      // type:String
      type: mongoose.Schema.Types.ObjectId,
      ref: "courses",
    },
    trainer_id:{
        // type:String
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
  employee_id:{
    type:Array,
      // type: mongoose.Schema.Types.ObjectId,
      // ref:'users'
  },
  meets:{
    type:Array
  }
});

module.exports = mongoose.model("batches", batchschema);  
