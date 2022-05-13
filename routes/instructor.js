const express = require("express");
const router = express.Router();
const instructor = require("../models/Instructor");
var formidable = require('formidable');
const path = require('path');
const fs = require('fs');
var validator = require('validator');
const auth = require("../middlewares/auth");
const jwt = require("jsonwebtoken");
var { ObjectId } = require("mongodb");

router.get("/",auth, async (req, res) => {
  const user = await instructor.findById(req.user.user_id);

  if(!user) 
  return res.status(400).json({message:''})
  
  return res.json({
    user_id: user._id,
    first_name: user.name,
    last_name: '',
    email: user.email,
    role:user.role
  });
});


router.get("/all", async (req, res) => {
  // const course_id = req.params.course_id;
  const allinstructors = await instructor.find();

  return res.json(
    allinstructors
  )
})

router.post('/login', async (req, res) => {

  const { email, password } = req.body;

  if (!validator.isEmail(email))
    return res.status(406).json({ message: "Enter valid email address" });

  const ins = await instructor.findOne({ email });

  if (!ins)
    return res
      .status(404)
      .json({ message: "Instructor not found check your email address!" });

  if (ins.password !== password) {
    console.log("Wrong email or password");
    return res.status(400).json({ message: "Incorrect email or password!" });
  }

  const sevenDaysToSeconds = 24 * 60 * 60 * 7 * 1000;
  const token = jwt.sign(
    {
      user_id: ins._id,
      email,
      first_name: ins.first_name,
      last_name: ins.last_name,
      phone: ins.phone,
      profile_image: ins.profile_image
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  ); 
  res.cookie("session-token", token, {
      maxAge: sevenDaysToSeconds
      /* ,
    secure: process.env.NODE_ENV === 'production' ? true : false */
    })
  ins.password=''
  ins.last_name=''
  return res.json({ message: "Logged in successfully!",token,user:ins });
})




router.patch("/update/:id", async (req, res) => {
  var updateUser = req.body;
  var id = req.params.id;
  const result = await instructor.updateOne({ _id: ObjectId(id) }, { $set: updateUser });
  res.json({ data: result });
})


router.get("/all", async (req, res) => {
  // const course_id = req.params.course_id;
  console.log("Api called");
  const allinstructors = await instructor.find();

  return res.json(allinstructors);
});
router.post("/create", async (req, res) => {
  console.log("API Called");
  //  const { name , description, designation,image,password } = req.body;

  // //  if (isEmpty(name) ||  isEmpty(description))
  // //  return res.status(406).json({ message: "This section cannot be empty" });
  //  console.log(name,description,designation,description,password);
  //  var form = new formidable.IncomingForm();

  // form.parse(req);
  // form.on('fileBegin', function (name, file){
  //     console.log(file);
  //     console.log(name);
  //     file.path = __dirname  + file.name;
  // });

  // form.on('file', function (name, file){
  //     console.log('Uploaded ' + file.name);
  // });
  const form = formidable({ multiples: true, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      // next(err);
      console.log(err);
      return;
    }
    console.log({ fields, files });
    const result = await instructor
      .create({
        name: fields.name,
        description: fields.description,
        designation: fields.designation,
        //  image,
        password: fields.password,
        image: files.image.newFilename,
        //  course_id:"61a1bbf344e0c28461b2fcd7"
        //  due_date,
        //  cose_id
      })
      .then(() => {
        console.log("Error1");
        res.json({ message: "Assignment assigned successfully " });
      })
      .catch((e) => {
        return res
          .status(500)
          .json({ message: "Server error try again later!" });
      });
    console.log("Hello" + files.image.filepath);
    console.log("Hello" + " " + files.image.originalFilename);
    console.log(
      "Path: " + path.join(__dirname + "/../public/") + files.image.newFilename
    );
    var oldpath = files.image.filepath;
    var newpath =
      path.join(__dirname + "/../public/") + files.image.newFilename;
    var rawdata = fs.readFileSync(oldpath);
    fs.writeFile(newpath, rawdata, function (err) {
      if (err) {
        console.log(err);
      }
      return res;
    });
  });

  // return res.json(200, {
  //     result: 'Upload Success'
  // });
  // console.log("bye");
  //  const result=await instructor.create({
  //      name,
  //      description,
  //      designation,
  //     //  image,
  //      password
  //     //  course_id:"61a1bbf344e0c28461b2fcd7"
  //     //  due_date,
  //     //  cose_id

  //  })
  //  .then(()=> res.json({message:"Assignment assigned successfully "}))
  //  .catch((e)=> {
  //      return res.status(500).json({ message: "Server error try again later!"})
  //  })
  //  if(result)
  //  {
  //    console.log("result true");
  //  }
});

router.get("/:id", async (req, res) => {
  console.log("Api clled with id");
  id = req.params.id;
  const result = await instructor.findOne({ _id: id });
  console.log(result);
  res.json({
    result,
  });
});

router.post('/ins',async(req,res)=>{
  const { ids } = req.body

  console.log(ids)
})


module.exports = router;
