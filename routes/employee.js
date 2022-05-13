const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Batch = require("../models/Batch");
var { ObjectId } = require("mongodb");

router.get('/allbatches/:id',async(req,res)=>{
    const id=req.params.id;
    const allbatches = await Batch.find({});
    const result=[];
    // console.log(allbatches);
   
    allbatches.map(async(e,i)=>{
        if(e.employee_id.indexOf(id)!=-1)
        {  
            const trainer_info=await User.find({_id:ObjectId(e.trainer_id)});
            console.log(trainer_info)
        //     delete e["employee_id"];
        //   e['trainer_info']=trainer_info;
            result.push(e);
            // console.log(result);
        }
    })
    res.send({result:result});
})








module.exports=router;