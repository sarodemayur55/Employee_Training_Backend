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


router.delete('/delete/:id',async(req, res)=>{
    const course_id=req.params.id;
    Course.deleteOne({_id:course_id},(err,result) =>{
        if(err)
        {
            res.status(400).send({message:"Error While Deleting The Course"});
        }
        if(result.deletedCount==1)
        {
            res.status(200).send({message:"Course Deleted Successfully"})
        }
        else
        {
            res.status(400).send({message:"Error While Deleting The Course"});
        }
    })
})

module.exports = router;
