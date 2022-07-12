require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("./config/database").connect();
//const { shouldSendSameSiteNone } = require("should-send-same-site-none");

const webinar = require("./routes/webinar")
const user = require("./routes/users");
const announcement = require("./routes/announcement")
const Class = require("./routes/class")
const course = require("./routes/course");
const auth = require("./middlewares/auth");
const assignments = require("./routes/assignments");
const instructor=require("./routes/instructor");
const user_course=require("./routes/user_course")
const userdata=require("./routes/userdata");
const record=require("./routes/record");
const batch=require("./routes/batch");
const employee=require("./routes/employee");
const test=require("./test");
const verifyToken=require("./middlewares/auth")
app.use(cookieParser());
// app.use(
//   cors({
//     origin: ["http://localhost:3000", "https://todo-plus.netlify.app"],
//     optionsSuccessStatus: 200,
//     credentials: true,
//   })
// );
const corsConfig = {
  origin: true,
  credentials: true,
};

app.use(cors(corsConfig));
app.options('*', cors(corsConfig));


app.use("/public",express.static(path.join(__dirname,"public")))
// app.use(cors({origin: 'http://localhost:3000', allowCredentials = "true"}))

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to server!" });
});

// app.use("/test", test);
app.use("/user", user);
// app.use("/announcement", announcement);
app.use("/course",verifyToken, course);
// app.use("/class", Class);
// app.use("/webinar", webinar);

// app.use("/assignments",assignments);
// app.use("/instructor",instructor);
// app.use('/user_course',user_course);
// app.use('/record',record);

// app.use('/userdata',userdata);



app.use('/batch',verifyToken,batch); 
app.use('/employee',verifyToken,employee); 





const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});
