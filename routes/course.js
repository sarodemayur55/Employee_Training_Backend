const express = require("express");
const router = express.Router();
var validator = require("validator");
var { ObjectId } = require("mongodb");
var Course = require("../models/Course");
const auth = require("../middlewares/auth");
router.post('/create/virtual',async(req,res)=>{
    const {course_name,mode,sessionsinfo,feedback_questions}=req.body;
   
    const result = await Course.create({
        course_name,
        mode,
        virtual:{
            sessionsinfo:sessionsinfo
        },
        feedback_questions:feedback_questions
    })
    if(result)
    {
        return res.json({message:"Course Designed"});
    }
    else
    {
        return res.json({message:"Server Error"});
    }



    // const {course_name,mode,ispretest,isposttest,no_of_sessions}=req.body;
    // // // console.log(mode+ispretest+isposttest+no_of_sessions);
    // // console.log(mode);
   
    // const result = await Course.create({
    //     course_name,
    //     mode,
    //     ispretest,
    //     isposttest,
    //     virtual:{
    //         no_of_sessions:no_of_sessions
    //     }
    // })
    // if(result)
    // {
    //     return res.json({message:"Course Designed"});
    // }
    // else
    // {
    //     return res.json({message:"Server Error"});
    // }
})


router.post('/create/elearning',async(req,res)=>{
    const {course_name,mode,sessionsinfo,feedback_questions}=req.body;
   
    const result = await Course.create({
        course_name,
        mode,
        elearning:{
            sessionsinfo:sessionsinfo
        },
        feedback_questions:feedback_questions
    })
    if(result)
    {
        return res.json({message:"Course Designed"});
    }
    else
    {
        return res.json({message:"Server Error"});
    }
})


router.get('/all',auth,async(req,res)=>{
    const AllCourses=await Course.find();
    res.json(AllCourses)
})

module.exports = router;
