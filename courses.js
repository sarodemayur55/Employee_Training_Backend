const express = require("express");
const router = express.Router();
var validator = require("validator");
var { ObjectId } = require("mongodb");
var Course = require("./models/Course");
var formidable = require('formidable');
const path = require('path');
const fs = require('fs');
var mv = require('mv');
const Instructor = require("./models/Instructor");

const isEmpty = (variable) => {
  return variable === undefined || variable?.trim() === "" || variable === null;
};
router.get("/category/:category", async (req, res) => {
  const category = req.params.category;
  console.log("Api category");
  const result = await Course.find({ category: category });
  console.log(result);
  res.json({
    result
  })
})
router.get("/top-featured", async (req, res) => {
  console.log("Top Featured API Called");
  const result = await Course.find({ isTopFeatured: true }, { course_name: 1, category: 1, price: 1 });
  console.log(result);
  res.json({
    result
  })
})
/*
router.post("/create", async (req, res) => {
  console.log("Course Create API Called");
  const {
    course_name,
    // course_author,
    duration,
    price,
    start_date,
    // language,
    // skill_level,
    no_of_lectures,
    description,
    // outcomes,
    // tags,
    category,
    // curriculum,
    lectures,
    learning_format,
    no_of_key_features,
    key_features,
    no_of_projects,
    projects,
    instructor_id,
    no_of_aboutfaqs,
    aboutfaqs,
    preview_links,
    isTopFeatured
  } = req.body;
console.log("Hello"+projects);
  // if (
  //   isEmpty(course_name) ||
  //   isEmpty(course_author) ||
  //   isEmpty(course_duration) ||
  //   isEmpty(course_price) ||
  //   !(new Date(start_date) > 0) ||
  //   isEmpty(language) ||
  //   isEmpty(skill_level) ||
  //   isEmpty(no_of_lectures) ||
  //   isEmpty(description) ||
  //   isEmpty(outcomes) ||
  //   isEmpty(tags) ||
  //   isEmpty(category) ||
  //   isEmpty(curriculum)
  // )
  //   return res.status(400).json({ message: "All fields are required!" });

    const result = await Course.create({
    course_name,
    // course_author,
    duration,
    price,
    start_date,
    // language,
    // skill_level,
    no_of_lectures,
    description,
    // outcomes,
    // tags,
    category,
    // curriculum,
    lectures,
    learning_format,
    no_of_key_features,
    key_features,
    no_of_projects,
    projects,
    instructor_id,
    no_of_aboutfaqs,
    aboutfaqs,
    preview_links,
    isTopFeatured

  });

  if (result) return res.json({ message: "Course created!" });

  return res.status(501).json({ message: "Server error try again later!" });
}); */

const moveFile = (fileSuffix, fileNames, file, index = '') => {
  let newFileName = fileSuffix + index + path.extname(file.newFilename)
  fileNames.push(newFileName)
  let oldPath = file.filepath
  let newPath = path.join(__dirname + "/public/") + newFileName;
  let rawData = fs.readFileSync(oldPath);
  fs.writeFileSync(newPath, rawData, er => console.log(er))
}

const mapFiles = (fileSuffix, namesArray, files) => {
  if (files.length) {
    for (i = 0; i < files.length; i++)
      moveFile(fileSuffix, namesArray, files[i], '-' + i)
  } else {
    moveFile(fileSuffix, namesArray, files)
  }
}

router.post('/create', async (req, res) => {
  const form = formidable({ multiples: true, keepExtensions: true });
  let collabNames = []
  let eduProviderNames = []
  let toolsNames = []
  let course_image_h = []
  let course_image_s = []

  form.parse(req, async (err, fields, files) => {
    const { course_name, description, category, start_date, duration, learning_format, price,
      instructor_id, isTopFeatured, no_of_lectures, lectures, no_of_key_features, key_features,
      no_of_projects, projects, no_of_aboutfaqs, aboutfaqs, no_of_preview_links,
      preview_links,enroll_link } = fields

    const courseId = new ObjectId().toString()

    console.log(fields)
    console.log(files)
    mapFiles(courseId + '-collabNames', collabNames, files.collaborator)
    mapFiles(courseId + '-eduProviderNames', eduProviderNames, files.edu_partner)
    mapFiles(courseId + '-toolsNames', toolsNames, files.tools)
    mapFiles(courseId + '-course_image_h', course_image_h, files.course_image_h)
    mapFiles(courseId + '-course_image_s', course_image_s, files.course_image_s)

    const result = await Course.create({
      _id: new ObjectId(courseId), course_name, description, category, start_date,
      duration: JSON.parse(duration), learning_format, price, instructor_id:JSON.parse(instructor_id), isTopFeatured,
      no_of_lectures, lectures: JSON.parse(lectures), no_of_key_features, key_features:JSON.parse(key_features),
      no_of_projects, projects: JSON.parse(projects), no_of_aboutfaqs,
      aboutfaqs: JSON.parse(aboutfaqs), no_of_preview_links,enroll_link,
      preview_links: JSON.parse(preview_links),collaborators:collabNames,course_image_s:course_image_s[0],
      edu_partners:eduProviderNames,tools:toolsNames, course_image_h:course_image_h[0],course_status:'ongoing'
    }).catch(e=>console.log(e))

    return res.json({message:'Course added!'})
  })
})

router.get("/all/:instructor_id", async (req, res) => {
  console.log("Course all called")
  const instructor_id = req.params.instructor_id;
  const courses = await Course.find({ instructor_id }, { course_name: 1 });
  return res.json({
    courses
  })
})
router.patch("/updateisTopFeatured/:id/:value", async (req, res) => {
  // var updateUser = req.body;
  var id = req.params.id;
  var value = req.params.value;
  const result = await Course.updateOne({ _id: ObjectId(id) }, { $set: { isTopFeatured: value } });
  res.json({ data: result });
})
router.get("/all", async (req, res) => {

  const courses = await Course.find({}, { course_name: 1, isTopFeatured: 1 });
  return res.json({
    courses
  })
})

router.get("/:course_id", async (req, res) => {
  const course_id = req.params.course_id;
  
  try {
    ObjectId(course_id)
  } catch {
    return res.status(404).json({ message: "Invalid course id !" });
  }
  
  const result = await Course.findOne({ _id: course_id }, { __v: 0 })
  const insResult = await Instructor.find({ _id: {$in:result.instructor_id} }, { __v: 0,password:0 })

  
  res.json({ data: result,ins:insResult });
});

router.patch("/:course_id", async (req, res) => {
  const course_id = req.params.course_id;
  const data = req.body

  try {
    ObjectId(course_id)
  } catch {
    return res.status(404).json({ message: "Invalid course id !" });
  }

  const result = await Course.updateOne({ _id: course_id }, data, { __v: 0 })

  if (result?.modifiedCount === 0) return res.status(400).json({ message: "Update failed!" });

  res.json({ data: result });
});

module.exports = router;
