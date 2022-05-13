const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Announcement = require("../models/Announcement");
const webinar = require("../models/webinar");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("mongodb");
var validator = require('validator');


router.get("/all",async(req,res)=>{
    course_id=req.params.course_id;
    const result = await webinar.find();
    console.log(result);
    return res.json({result});
    
})


router.post("/create",async(req,res)=>{
    const {name,url,date_time} = req.body;
    // if(!validator.isDate(date,['-']))
    // {
    //     return res.json({message:"Wrong Date"})
    // }

    const result = await webinar.create({
        name,
        url,
        date_time,
        
        // Date:date,
        // course_id
    })
    console.log(name,url,date_time);
    if(result){
        return res.json({message:" Live Webinar"})
    }
    else{
        return res.json({message:"Server Error"})
    }
 
})

module.exports=router;