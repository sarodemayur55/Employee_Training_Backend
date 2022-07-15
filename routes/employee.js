const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Batch = require("../models/Batch");
var { ObjectId } = require("mongodb");
var Course = require("../models/Course");
router.get('/batchinfo/:id',async(req, res)=>{
    const id=req.params.id;
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
    try{
        const allbatches = await Batch.find({}).populate('course_id');
    const result=[];
   
    allbatches.map(async(e,i)=>{
        if(e.employee_id.indexOf(id)!=-1)
        {  
            result.push(e);
        }
    })
    res.send({result:result});
    }
    catch(e){
        res.send({error:e})
    }
})








module.exports=router;