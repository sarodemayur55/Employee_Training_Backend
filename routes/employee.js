const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Batch = require("../models/Batch");
var { ObjectId } = require("mongodb");
var Course = require("../models/Course");
router.get('/batchinfo/:id',async(req, res)=>{
    const id=req.params.id;
    // console.log(id)
   try{
        const batch=await Batch.find({_id:ObjectId(id)});
        var courseinfo=await Course.findOne({_id:ObjectId(batch[0].course_id)});
        var trainerinfo=await User.findOne({_id:ObjectId(batch[0].trainer_id)},{password:false});
        res.send({batchinfo:{batchinfo:batch[0],courseinfo:courseinfo,trainerinfo:trainerinfo}});
   }
   catch(err){
       console.error(err);
       res.status(404).send({message:"Error While Fetching"});
   }
    
})
router.get('/allbatches/:id',async(req,res)=>{
    const id=req.params.id;
    const allbatches = await Batch.find({});
    const result=[];
    // console.log(allbatches);
   
    allbatches.map(async(e,i)=>{
        if(e.employee_id.indexOf(id)!=-1)
        {  
            // console.log(e.trainer_id)
            // const trainer_info=await User.find({_id:ObjectId(e.trainer_id)});
            // console.log(trainer_info)
        //     delete e["employee_id"];
        //   e['trainer_info']=trainer_info;
            result.push(e);
            // console.log(result);
        }
    })
    res.send({result:result});
})








module.exports=router;