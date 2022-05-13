const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Announcement = require("../models/Announcement");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("mongodb");
var validator = require('validator');


router.get("/:course_id",async(req,res)=>{
    course_id=req.params.course_id;
    console.log(course_id);
    const result=await Announcement.find({course_id:course_id});
    console.log(result);
    return res.json({data:result});
})

router.post("/create",async(req,res)=>{
    const {description,date,course_id}=req.body;
    if(!validator.isDate(date,['-']))
    {
        return res.json({message:"Wrong Date"})
    }
    if(!validator.isLength(description,{min:10,max:100}))
    {
        return res.json({message:"Wrong Description"})
    }

    const result = await Announcement.create({
        description,
        Date:date,
        course_id
    })
    
    if(result)
    {
        return res.json({message:"Announcement created"});
    }
    else
    {
        return res.json({message:"Server Error"});
    }
})
module.exports=router;