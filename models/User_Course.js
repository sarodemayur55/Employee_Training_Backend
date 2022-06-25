const mongoose = require("mongoose");

const userCourseSchema = new mongoose.Schema({
    user_id: {
        type: String
    },
    course_id: {
        // type: String
        type: mongoose.Schema.Types.ObjectId,
        ref:'courses'
    },
    enrollment_date: {
        type: Date
    },
    status: {
        type: String
    },
});

module.exports = mongoose.model("user_course", userCourseSchema);
