const express = require("express");
const router = express.Router();
const UserData = require("../models/UserData");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("mongodb");

router.post("/getdata",async(req,res)=>{
    console.log("API Called");
    const {first_name,last_name,email,number} = req.body;
    console.log(first_name,last_name,email,number);
    const result = await UserData.create({
        first_name,last_name,email,number
    })
    // console.log(name,url,date_time);
    if(result){
        return res.json({message:"User Data added"})
    }
    else{
        return res.json({message:"Server Error"})
    }
})





module.exports=router;