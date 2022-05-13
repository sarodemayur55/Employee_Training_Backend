const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("mongodb"); 
const validator  = require ("validator");
const bodyParser = require ("body-parser"); 


const isEmpty = (variable) => {
    return variable === undefined || variable?.trim() === "" || variable === null;
};
  

// const urlencodedParser = bodyParser.urlencoded({extends : false})

//************************************************   TEACHER   ********************************************************** */

//for teacher to post
router.post("/create"  ,  async (req,res) => {
   console.log("API Called");
    const { name , description,marks,due_date,course_id } = req.body;

    if (isEmpty(name) ||  isEmpty(description))
    return res.status(406).json({ message: "This section cannot be empty" });
    
    const result=await Assignment.create({
        name,
        description,
        marks,
        due_date,
        course_id
        // due_date,
        // cose_id

    })
    .then(()=> res.json({message:"Assignment assigned successfully "}))
    .catch((e)=> {
        return res.status(500).json({ message: "Server error try again later!"})
    })
    if(result)
    {
      console.log("result true");
    }
});

//for teacher to delete
router.delete("/:assignment_id" ,async (req,res) => {
  
  
    const assignment_id = req.params.assignment_id;
  
  
    try{
        ObjectId(assignment_id)
        console.log(assignment_id)
      }catch{
        return res.status(404).json({ message: "Invalid Assignment id !" });
    }
  
   
    await Assignment.findByIdAndDelete (assignment_id);
    return res.json({message: "Assignment Deleted Successfully"})
  
  }) 

//************************************************   STUDENT   ********************************************************** */
//for student to get


router.get("/all/:course_id",async(req,res)=>{
    const course_id = req.params.course_id;
    const assignment = await Assignment.find ({course_id});
   
    return res.json({
      assignment
    })


})

//for student to submit
router.post("/submit"  ,  async (req,res) => {
   
    
    const { link } = req.body;

    if (isEmpty(link))
    return res.status(406).json({ message: "This section cannot be empty" });
    
    Assignment.create({
      link,
    })
    .then(()=> res.json({message:"Assignment Submitted successfully "}))
    .catch((e)=> {
        return res.status(500).json({ message: "Server error try again later!"})
    })
});



module.exports = router;