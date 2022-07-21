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
const verifyToken = require("../middlewares/auth")
const mailsender = require('../utils/sendmail');
var generator = require('generate-password');
router.get("/all/generate-excel-sheet", async (req, res) => {
  const allusers = await User.find({}, { password: 0, _id: 0, role: 0, __v: 0, profile_image: 0 }, { lean: true });
  const csvFields = ['_id', 'first_name', 'last_name', 'email', 'phone'];
  const json2csvParser = new Json2csvParser({ csvFields });
  const csv = json2csvParser.parse(allusers);
  res.set({ 'Content-Type': 'text/csv;charset=utf-8' })
  res.send(csv)
});
router.get("/all", verifyToken, async (req, res) => {
  const allusers = await User.find({}, { password: 0, _id: 0, role: 0, __v: 0, profile_image: 0 }, { lean: true });
  const csvFields = ['_id', 'first_name', 'last_name', 'email', 'phone'];
  const json2csvParser = new Json2csvParser({ csvFields });
  const csv = json2csvParser.parse(allusers);
  fs.writeFile('customer.csv', csv, function (err) {
    if (err) throw err;
  });

  return res.json(allusers);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!validator.isEmail(email))
    return res.status(406).json({ message: "Enter valid email address" });

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(404)
      .json({ message: "User Not Found. Check Your Email ID!" });
  const hash = createHmac("sha256", secret).update(password).digest("hex");
  // console.log(hash);
  if (user.password !== hash) {
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
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.cookie("session_token", token, {
    maxAge: sevenDaysToSeconds,
    httpOnly: false,
    Secure:true
  })
  user.password = ''
  return res.send({ message: "Logged in successfully!", token, user });
});

router.post("/register", async (req, res) => {
  const { email, password, first_name, last_name, role } = req.body;
  if (!validator.isEmail(email) || !validator.isStrongPassword(password, { minLength: 0, minNumbers: 0, minUppercase: 0, minSymbols: 0 })) {
    return res.status(406).json({ message: "Invalid email or password!" });
  }

  const email_exists = await User.findOne({ email });
  if (email_exists)
    return res.status(409).json({ message: "Email already exists!" });
  if (validator.isEmpty(first_name) || validator.isEmpty(last_name)) {
    return res.status(406).json({ message: "One or More fields are empty" });
  }
  const hash = createHmac("sha256", secret).update(password).digest("hex");

  User.create({
    email: email.toLowerCase(),
    password: hash,
    first_name,
    last_name,
    role: role
  })
    .then(() => res.json({ message: "Account created successfully!" }))
    .catch((er) => {
      return res.status(500).json({ message: "Server error try again later!" });
    });
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user.user_id);

  if (!user) return res.status(400)

  return res.json({
    user_id: user._id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    role: user.role
  });
});

router.get("/logout", async (req, res) => {
  // res.cookie.set('session_token','', { maxAge: 0,
  //   domain: "employee-training-system.vercel.app.somedomain"}).send({ message: "Logged out successfully!" });

  res.cookie("session_token", "", {
    // maxAge: sevenDaysToSeconds,
    httpOnly: false,
    Secure:true,
    expires: new Date(Date.now()),
    overwrite: true
  }) .send({ message: "Logged out successfully!" });


  // res
  //   .clearCookie("session_token")
  //   .send({ message: "Logged out successfully!" });
});

router.patch("/update/:id", async (req, res) => {
  var updateUser = req.body;
  var id = req.params.id;
  const result = await User.updateOne({ _id: ObjectId(id) }, { $set: updateUser });
  res.json({ data: result });
})



router.post("/register/employeedatabyadmin/:role", verifyToken, async (req, res) => {
  const role = req.params.role;
  var data = req.body.data;
  var passwords = generator.generateMultiple(data.length, {
    length: 10,
    uppercase: true,
    numbers: true
  });

  if (role == 'trainer') {
    for (var i = 0; i < data.length; i++) {
      const hash = createHmac("sha256", secret).update(passwords[i]).digest("hex");
      data[i].password = hash;
      var subject = 'Login Credentials'
      var body = `Greetings From Admin:
                Your Login Credentials:
                username: ${data[i].email}
                password: ${passwords[i]}          
            `
      mailsender(data[i].email, subject, body);
    }
  }
  const result = User.insertMany(data).then(() => {
  })
    .catch(() => {
    });
  res.json({ data: "API Testing" })
})



router.post("/register/employeedatabyadmin/excel/:role", verifyToken, async (req, res) => {
  const role = req.params.role;
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
      }
      const result = excelToJson({
        sourceFile: newpath,
        sheets: [{
          // Excel Sheet Name
          name: 'Sheet1',
          // Header Row -> be skipped and will not be present at our result object.
          header: {
            rows: 1
          },
          // Mapping columns to keys
          columnToKey: {
            // A: '_id',
            A: 'first_name',
            B: 'last_name',
            C: 'email',
            D: 'phone'
            // D: 'age'
          }
        }]
      });

      for (var i = 0; i < result.Sheet1.length; i++) {
        result.Sheet1[i].role = role;
      }
      data=result.Sheet1;
      if (role == 'trainer') {
        var passwords = generator.generateMultiple(data.length, {
          length: 10,
          uppercase: true,
          numbers: true
        });
        for (var i = 0; i < data.length; i++) {
          const hash = createHmac("sha256", secret).update(passwords[i]).digest("hex");
          data[i].password = hash;
          var subject = 'Login Credentials'
          var body = `Greetings From Admin:
                    Your Login Credentials:
                    username: ${data[i].email}
                    password: ${passwords[i]}          
                `
          mailsender(data[i].email, subject, body);
        }
      }
      User.insertMany(result.Sheet1, (err, data) => {
        if (err) {
        } else {
        }
      });
    });
    res.json(files);
  });
})




router.get('/all/employees', verifyToken, async (req, res) => {
  const allemployees = await User.find({ role: "employee" }, { password: 0, _id: 0, role: 0, __v: 0, profile_image: 0 });
  res.json(allemployees)
})

router.get('/all_for_trainer_batch_create/employees', async (req, res) => {
  const allemployees = await User.find({ role: "employee" }, { password: 0, role: 0, __v: 0 });
  res.json(allemployees)
})


module.exports = router;
