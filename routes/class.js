const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Announcement = require("../models/Announcement");
const Class = require("../models/Class");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("mongodb");
var validator = require('validator');


router.get("/:course_id/",async(req,res)=>{
    course_id=req.params.course_id;
    const result = await Class.find({course_id:course_id,date_time:{$gt:Date.now()}});
    console.log(result);
    return res.json({result});
    
})


router.post("/create",async(req,res)=>{
    const {name,url,date_time,course_id} = req.body;
    // if(!validator.isDate(date,['-']))
    // {
    //     return res.json({message:"Wrong Date"})
    // }

    const result = await Class.create({
        name,
        url,
        date_time,
        course_id
        // Date:date,
        // course_id
    })
    console.log(name,url,date_time);
    if(result){
        return res.json({message:"Class Live"})
    }
    else{
        return res.json({message:"Server Error"})
    }
 
})

module.exports=router;