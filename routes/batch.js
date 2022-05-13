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



router.get("/batch/:batch_id",async(req,res)=>{
    console.log("tempppp")

    batch_id=req.params.batch_id;
    console.log(batch_id);
    try{
        const allEmployees=await Batch.find({_id:batch_id},{employee_id:1,_id:0});
        console.log(allEmployees);
        const temp=allEmployees.map(a=>a.employee_id);
        console.log(allEmployees[0].employee_id);
        const testing=await User.find({"_id":{$in:allEmployees[0].employee_id}},{password:0});
        console.log(testing+"Hello");
    // const result=await Batch.find({course_id:course_id});
    // console.log(result);
    // return res.json({data:result});
    return res.json({response:"Get Api called for batch"})
    }
    catch(e){
        console.log("Error Caught");
        console.log(e);
        res.status(400).json({response:"Invalid Data Error"})
    }
    
    
    
})







router.patch("/:batch_id", async (req, res) => {
    batch_id=req.params.batch_id;
    console.log("Hello"+batch_id);
    // var updateUser = req.body;
    // var id = req.params.id;
    const data=req.body;
    console.log(data);
    const result = await Batch.updateOne({ _id: ObjectId(batch_id) }, { $push: { "meets": data } });
    res.json({ data: result });
  })

router.get("/trainer/:trainer_id",async(req,res)=>{
   
    trainer_id=req.params.trainer_id;
    console.log(trainer_id);
    try{
        const allBatches=await Batch.find({trainer_id},{employee_id:1,batch_name:1,_id:0});
        console.log(allBatches);
        const temp=[]
        const temp1=await allBatches.map(async(b,i)=>{
            const testing=await User.find({"_id":{$in:b.employee_id}},{password:0});
            console.log("Hello")
            console.log(testing);
            const obj = Object.assign({}, b);
            obj.employee_data=testing;
            allBatches[i].employee_id=testing;
            // console.log("test"+i+allBatches[i]);
            temp.push(allBatches[i]);
            // console.log("Mayur"+obj.employee_id)
            return allBatches[i];

        })
        const results = await Promise.all(temp1);
        // console.log("New");
        // console.log(results);
        // console.log("test");
        // console.log(temp1);
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
    console.log('fdsdfsddsfsd')
    console.log(employee_id)


    // var password = generator.generate({
    //     length: 10,
    //     numbers: true
    // });
    
    // 'uEyMTw32v9'
   
    var passwords = generator.generateMultiple(employee_id.length, {
        length: 10,
        uppercase: true,
        numbers: true
    });
    console.log(passwords);
    // console.log(hash)
    const employees=await User.find({_id:{$in:employee_id}});

    console.log(employees,"getting");
    employees.map(async(e,i)=>{
        const hash = createHmac("sha256", secret).update(passwords[i]).digest("hex");
        const res1=await User.updateOne({ _id: e._id  }, { $set: {password:hash} });
        var subject='Login Credentials'
        var body=`Greetings From Mayur:
                    Your Login Credentials:
                    username: ${e.email}
                    password: ${passwords[i]}          
                `
        mailsender(e.email,subject,body);
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


router.get("/sendmail",async(req, res) =>{
    console.log("tempppp")
    mailsender();
    res.send({message:"Bug Solved"});
})

module.exports=router;