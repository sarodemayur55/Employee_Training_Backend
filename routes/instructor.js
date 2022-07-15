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
  const allinstructors = await instructor.find();

  return res.json(allinstructors);
});
router.post("/create", async (req, res) => {

  const form = formidable({ multiples: true, keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return;
    }
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
        res.json({ message: "Assignment assigned successfully " });
      })
      .catch((e) => {
        return res
          .status(500)
          .json({ message: "Server error try again later!" });
      });
    var oldpath = files.image.filepath;
    var newpath =
      path.join(__dirname + "/../public/") + files.image.newFilename;
    var rawdata = fs.readFileSync(oldpath);
    fs.writeFile(newpath, rawdata, function (err) {
      if (err) {
      }
      return res;
    });
  });

});

router.get("/:id", async (req, res) => {
  id = req.params.id;
  const result = await instructor.findOne({ _id: id });
  res.json({
    result,
  });
});

router.post('/ins',async(req,res)=>{
  const { ids } = req.body;
})


module.exports = router;
