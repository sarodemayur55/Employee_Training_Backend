const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Batch = require("../models/Batch");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("mongodb");
var validator = require('validator');

const mailsender=require('../utils/sendmail');
const secret = process.env.PASSWORD_SECRET;
const { createHmac } = require("crypto");
var generator = require('generate-password');
var Course = require("../models/Course");


router.get("/batch/:batch_id",async(req,res)=>{

    batch_id=req.params.batch_id;
    try{
        const allEmployees=await Batch.find({_id:batch_id},{employee_id:1,_id:0});
   
    return res.json({response:"Get Api called for batch"})
    }
    catch(e){
        res.status(400).json({response:"Invalid Data Error"})
    }
    
    
    
})







router.patch("/:batch_id", async (req, res) => {
    batch_id=req.params.batch_id;
    const data=req.body;
    const result = await Batch.updateOne({ _id: ObjectId(batch_id) }, { $push: { "meets": data } });
    res.json({ data: result });
  })

router.get("/trainer/:trainer_id",async(req,res)=>{
   
    trainer_id=req.params.trainer_id;
    try{
        const allBatches=await Batch.find({trainer_id},{employee_id:1,batch_name:1,course_id:1})
                                    .populate("course_id")
        const temp=[]
        const temp1=await allBatches.map(async(b,i)=>{
            const testing=await User.find({"_id":{$in:b.employee_id}},{password:0});
       
            const obj = Object.assign({}, b);
            obj.employee_data=testing;
            allBatches[i].employee_id=testing;
            temp.push(allBatches[i]);
            return allBatches[i];

        })
        const results = await Promise.all(temp1);
        res.json(results);
    }
    catch(e)
    {

    }
})


router.post("/create",async(req,res)=>{
    const {batch_name,course_id,trainer_id,employee_id}=req.body;

    const result = await Batch.create({
        batch_name,
        course_id,
        trainer_id,
        employee_id
    })

   
    var passwords = generator.generateMultiple(employee_id.length, {
        length: 10,
        uppercase: true,
        numbers: true
    });
    const employees=await User.find({_id:{$in:employee_id}});

    employees.map(async(e,i)=>{
        
        const hash = createHmac("sha256", secret).update(passwords[i]).digest("hex");
        if(e.password==null)
        {
            const res1=await User.updateOne({ _id: e._id  }, { $set: {password:hash} });
        var subject='Login Credentials'
        var body=`Greetings From Mayur:
                    Your Login Credentials:
                    username: ${e.email}
                    password: ${passwords[i]}          
                `
        mailsender(e.email,subject,body);
        }
        
    })
    // const result1 = await User.updateMany({ _id: { $in:employee_id }  }, { $set: {password:hash} });
    if(result)
    {
        
        return res.json({message:"Batch created"});
    }
    else
    {
        return res.json({message:"Server Error"});
    }
})

router.delete("/deletebatch/:batch_id",async(req, res) =>{
    batch_id=req.params.batch_id;
        Batch.deleteOne({_id:batch_id},(err,result) =>{
            if(err)
            {
                res.status(400).send({message:"Error While Deleting The Batch"});
            }
            if(result.deletedCount==1)
            {
                res.status(200).send({message:"Batch Deleted Successfully"})
            }
            else
            {
                res.status(400).send({message:"Error While Deleting The Batch"});
            }
        })
    
})

router.get("/sendmail",async(req, res) =>{
    mailsender();
    res.send({message:"Bug Solved"});
})

module.exports=router;