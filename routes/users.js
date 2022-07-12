const express = require("express");
const router = express.Router();
const { createHmac } = require("crypto");
const secret = process.env.PASSWORD_SECRET;
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");
const { v4: uuidv4 } = require("uuid");
const { ObjectId } = require("mongodb");
var validator = require('validator');
const Json2csvParser = require('json2csv').Parser;
const fs = require('fs');
const path = require('path');
const formidable = require('formidable');
const excelToJson = require('convert-excel-to-json');
const verifyToken=require("../middlewares/auth")
router.get("/all/generate-excel-sheet", async (req, res) => {
  // const course_id = req.params.course_id;
  // console.log("Api called");
  const allusers = await User.find({},{password:0,_id:0,role:0,__v:0,profile_image:0},{lean:true});
  const csvFields = [ '_id','first_name','last_name','email', 'phone'];
  const json2csvParser = new Json2csvParser({ csvFields });
	const csv = json2csvParser.parse(allusers);
  // console.log(allusers)
	// // console.log(csv);
  // fs.writeFile('customer.csv', csv, function(err) {
	// 	if (err) throw err;
	// 	// console.log('file saved');
	// });
  res.set({'Content-Type':'text/csv;charset=utf-8'})
  res.send(csv)
  
  // return res.json(allusers);
});
router.get("/all",verifyToken, async (req, res) => {
  // const course_id = req.params.course_id;
  // console.log("Api called");
  const allusers = await User.find({},{password:0,_id:0,role:0,__v:0,profile_image:0},{lean:true});
  const csvFields = [ '_id','first_name','last_name','email', 'phone'];
  const json2csvParser = new Json2csvParser({ csvFields });
	const csv = json2csvParser.parse(allusers);
  // console.log(allusers)
	// // console.log(csv);
  fs.writeFile('customer.csv', csv, function(err) {
		if (err) throw err;
		// console.log('file saved');
	});
  
  return res.json(allusers);
});

router.post("/login", async (req, res) => {
  // console.log("Login API Called");
  const { email, password } = req.body;
  // console.log("Check 1"+email+"Hello");
  console.log(email,password);
  if (!validator.isEmail(email))
    return res.status(406).json({ message: "Enter valid email address" });

  const user = await User.findOne({ email });
 // console.log(user)
  if (!user)
    return res
      .status(404)
      .json({ message: "User Not Found. Check Your Email ID!" });
      // console.log("Check 2");
  const hash = createHmac("sha256", secret).update(password).digest("hex");
  // console.log(user)
  // console.log(hash)
  if (user.password !== hash) {
    // console.log("Wrong email or password");
    return res.status(400).json({ message: "Incorrect email or password!" });
  }

  const sevenDaysToSeconds = 24 * 60 * 60 * 7 * 1000;
  const token = jwt.sign(
    {
      user_id: user._id,
      email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      profile_image: user.profile_image,
      role:user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  ); 
  res.cookie("session_token", token, {
      maxAge: sevenDaysToSeconds,
      httpOnly: true 
      /* ,
    secure: process.env.NODE_ENV === 'production' ? true : false */
    })
  user.password=''
  return res.send({ message: "Logged in successfully!",token,user });
});

router.post("/register", async (req, res) => {
  // console.log("Api Called");
  const { email, password, first_name, last_name,role } = req.body;

  // console.log(email + password + first_name + last_name+role);
  if (!validator.isEmail(email) || !validator.isStrongPassword(password, { minLength: 0, minNumbers: 0, minUppercase: 0, minSymbols: 0 })) {
    // console.log("Hello" + validator.isStrongPassword(password));
    return res.status(406).json({ message: "Invalid email or password!" });
  }

  const email_exists = await User.findOne({ email });
  if (email_exists)
    return res.status(409).json({ message: "Email already exists!" });
  if (validator.isEmpty(first_name) || validator.isEmpty(last_name)) {
    // console.log("Hello");
    return res.status(406).json({ message: "One or More fields are empty" });
  }
  // // console.log("Hello" + validator.isMobilePhone(phone.toString(), ["en-IN"]));
  // if (!validator.isMobilePhone(phone.toString(), ["en-IN"])) {
  //   return res.status(406).json({ message: "Incorrect Phone Number" });
  // }
  const hash = createHmac("sha256", secret).update(password).digest("hex");

  User.create({
    email: email.toLowerCase(),
    password: hash,
    first_name,
    last_name,
    role:role
  })
    .then(() => res.json({ message: "Account created successfully!" }))
    .catch((er) => {
      return res.status(500).json({ message: "Server error try again later!" });
    });
});

router.get("/",auth, async (req, res) => {
  const user = await User.findById(req.user.user_id);

  if(!user) return res.status(400)
  
  return res.json({
    user_id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role:user.role
  });
});

router.get("/logout", async (req, res) => {
  res
    .clearCookie("session_token")
    .send({ message: "Logged out successfully!" });
});

router.patch("/update/:id", async (req, res) => {
  var updateUser = req.body;
  var id = req.params.id;
  const result = await User.updateOne({ _id: ObjectId(id) }, { $set: updateUser });
  res.json({ data: result });
})



router.post("/register/employeedatabyadmin",verifyToken,async(req,res)=>{
  // console.log("Employee Data By Admin API Called");
  var data=req.body;
  // console.log(data);
  const result=User.insertMany(data.data).then(()=>{
    // console.log("Created")
  })
  .catch(()=>{
    // console.log("error")
  });
  res.json({data:"API Testing"})
})



router.post("/register/employeedatabyadmin/excel",verifyToken,async(req,res)=>{
  console.log("Employee Data By Admin Excel API Called");
  
  const form = formidable({ keepExtensions: true });
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }


    var oldpath = files.File.filepath;
    var newpath =
      path.join(__dirname + "/../public/") + files.File.newFilename;
    var rawdata = fs.readFileSync(oldpath);
    fs.writeFile(newpath, rawdata, function (err) {
      if (err) {
        console.log(err);
      }
      const result = excelToJson({
        sourceFile: newpath,
        sheets:[{
          // Excel Sheet Name
          name: 'Sheet1',
          // Header Row -> be skipped and will not be present at our result object.
          header:{
          rows: 1
          },
          // Mapping columns to keys
          columnToKey: {
          // A: '_id',
          A: 'first_name',
          B: 'email',
          C:'role'
          // D: 'age'
          }
          }]
    });
     
      console.log("dsfdsf")
      const hash = createHmac("sha256", secret).update("12345678").digest("hex");
      for(var i=0;i<result.Sheet1.length;i++)
      {
        // result.Sheet1[i].password=hash;
      }
      console.log(result)

      User.insertMany(result.Sheet1,(err,data)=>{  
        if(err){  
        console.log(err);  
        }else{  
          console.log("Hello");
        // res.redirect('/');  
        }  
        }); 
   
      // return res;
    });



    console.log(files)
   
    console.log(files.File.newFilename)
    res.json(files);
  });
  // var data=req.body;



  // // console.log(data);
  // const result=User.insertMany(data.data).then(()=>{
  //   // console.log("Created")
  // })
  // .catch(()=>{
  //   // console.log("error")
  // });
  // res.json({data:"API Testing"})
})




router.get('/all/employees',verifyToken,async(req,res)=>{
  // console.log("Api called");
  const allemployees = await User.find({role:"employee"},{password:0,_id:0,role:0,__v:0,profile_image:0});
  // // console.log(allemployees);
  res.json(allemployees)
})

router.get('/all_for_trainer_batch_create/employees',async(req,res)=>{
  // console.log("Testing Api Called");
  const allemployees = await User.find({role:"employee"},{password:0,role:0,__v:0});
  // // console.log(allemployees);
  res.json(allemployees)
})


module.exports = router;
