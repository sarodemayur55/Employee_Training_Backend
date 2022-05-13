const express = require("express");
const User_Course = require("../models/User_Course");
const router = express.Router();
const User = require("../models/User");
const { ObjectId } = require("mongodb");
var Course = require("../models/Course");
const Class = require("../models/Class");
router.get("/all-courses/:user_id",async(req,res)=>{
    const user_id=req.params.user_id;
    console.log(user_id);
    const allMyCourses=await User_Course.find({user_id},{course_id:1,_id:0});
    console.log(allMyCourses);

    const temp=allMyCourses.map(a=>a.course_id);
    console.log(temp);
    const testing=await Course.find({"_id":{$in:temp}},{password:0});
    console.log(testing);

    return res.json({
        testing
    })
})




router.get("/all-classes/:user_id",async(req,res)=>{
    const user_id=req.params.user_id;
    console.log(user_id);
    const allMyCourses=await User_Course.find({user_id},{course_id:1,_id:0});
    console.log(allMyCourses);

    const temp=allMyCourses.map(a=>a.course_id);
    console.log(temp);
    const allClasses=await Class.find({"course_id":{$in:temp}});
    console.log(allClasses);

    return res.json({
        allClasses
    })
})






router.get("/all-users/:course_id",async(req,res)=>{
    const course_id=req.params.course_id;
    console.log(course_id);
    const allStudents=await User_Course.find({course_id},{user_id:1,_id:0})
    console.log(allStudents);
    // console.log(allStudents);
    // const testing=await User.aggregate([
        // {
        //     "$project": {
        //       "_id": {
        //         "$toString": "$_id"
        //       },
        //       "first_name":"$first_name"
        //     }
        //   },
        // {
        //     $lookup:{
        //         from:"user_courses",
        //         // localField:"_id",
        //         // foreignField:"user_id",
        //         pipeline: [
        //             { $match: { course_id: "61af34b1dc0bb8b0a78cb2ea" } },
                    
        //          ],
        //         as:"user_courses"
        //     }
            
        // },
        // {
        //     $unwind: "$testing",
        // },
    
    // ])
    // console.log(testing);
    console.log(allStudents);
    const temp=allStudents.map(a=>a.user_id);
    console.log(temp);
    const testing=await User.find({"_id":{$in:temp}},{password:0});
    console.log(testing);

    return res.json({
        testing
    })
})
router.post('/add-user',async(req,res)=>{
    const {user_id,course_id,enrollment_date,status}=req.body;
    console.log(user_id,course_id,enrollment_date,status);
    const result=await User_Course.create({
       user_id,
       course_id,
       enrollment_date,
       status
  
    })
    .then(()=> {console.log("Error1");;res.json({message:"User added after payment successfully "})})
    .catch((e)=> {
        return res.status(500).json({ message: "Server error try again later!"})
    })
})
module.exports = router;
