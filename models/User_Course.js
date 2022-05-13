const mongoose = require("mongoose");

const userCourseSchema = new mongoose.Schema({
    user_id: { type: String },
    course_id: { type: String },
    enrollment_date: { type: Date },
    status: { type: String },
});

module.exports = mongoose.model("user_course", userCourseSchema);
