const express = require("express");
const router = express.Router();
var validator = require("validator");
var { ObjectId } = require("mongodb");
var Course = require("../models/Course");
const auth = require("../middlewares/auth");
router.post('/create/virtual', async (req, res) => {
    const { course_name, mode, sessionsinfo, feedback_questions } = req.body;
    const result = await Course.create({
        course_name,
        mode,
        virtual: {
            sessionsinfo: sessionsinfo
        },
        feedback_questions: feedback_questions
    })
    if (result) {
        return res.json({ message: "Course Designed" });
    }
    else {
        return res.json({ message: "Server Error" });
    }

})


router.post('/create/elearning', async (req, res) => {
    const { course_name, mode, sessionsinfo, feedback_questions } = req.body;

    const result = await Course.create({
        course_name,
        mode,
        elearning: {
            sessionsinfo: sessionsinfo
        },
        feedback_questions: feedback_questions
    })
    if (result) {
        return res.json({ message: "Course Designed" });
    }
    else {
        return res.json({ message: "Server Error" });
    }
})


router.get('/all', auth, async (req, res) => {
    const AllCourses = await Course.find();
    res.json(AllCourses)
})


router.delete('/delete/:id', async (req, res) => {
    const course_id = req.params.id;
    Course.deleteOne({ _id: course_id }, (err, result) => {
        if (err) {
            res.status(400).send({ message: "Error While Deleting The Course" });
        }
        if (result.deletedCount == 1) {
            res.status(200).send({ message: "Course Deleted Successfully" })
        }
        else {
            res.status(400).send({ message: "Error While Deleting The Course" });
        }
    })
})

router.post('/addsession/', async (req, res) => {
    const { date, description, mode, link, venue, course_id, index } = req.body;
    Course.findOne({ _id: course_id }, (err, result) => {
        if (err) {
            res.send({ message: "Error While Adding Session" });
            return;
        }
        var temp = result.virtual[index];
        result.virtual.sessionsinfo[index].date = new Date(date);
        result.virtual.sessionsinfo[index].description = description;
        result.virtual.sessionsinfo[index].mode = mode;
        result.virtual.sessionsinfo[index].link = link;
        result.virtual.sessionsinfo[index].venue = venue;
        result.virtual.sessionsinfo[index].added = true;
        result.save(function (error) {
            if (error) {
                console.error('ERROR!');
                res.send({ message: "Error While Adding Session" });
                return;

            }
        });
        res.send({ message: "Session Added Successfully" });
        return;
    })
})

router.patch('/updatecompletedstatus', async (req, res) => {
    const { course_id, session_index, status } = req.body;
    Course.findOne({ _id: course_id }, (err, result) => {
        if (err) {
            res.send({ message: "Error While Adding Session" });
            return;
        }
        var temp = result.virtual[session_index];
        result.virtual.sessionsinfo[session_index].completed=status;
        result.save(function (error) {
            if (error) {
                console.error('ERROR!');
                res.send({ message: "Error While Updating Status" });
                return;

            }
        });
        res.send({ message: "Status Updated Successfully" });
        return;
    })

})
router.get('/getcourse/:id',async(req, res)=>{
    const id= req.params.id;
    const result= await Course.find({_id: id});
    res.send(result);

})
module.exports = router;
