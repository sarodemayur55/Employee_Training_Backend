require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("./config/database").connect();
const user = require("./routes/users");
const course = require("./routes/course");
const auth = require("./middlewares/auth");
const batch=require("./routes/batch");
const employee=require("./routes/employee");
const test=require("./test");
const verifyToken=require("./middlewares/auth")
const bcrypt = require("bcryptjs");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const { access_key_id,secret_access_key } = process.env;





const whitelist = ['http://localhost:3000', 'http://developer2.com','https://ets-9hwzzfgyb-sarodemayur55.vercel.app','https://ets-1yxl0oqw0-sarodemayur55.vercel.app','https://ets-sarodemayur55.vercel.app']
app.use(function (req, res, next) {
  const corsWhitelist = [
    'https://ets-9hwzzfgyb-sarodemayur55.vercel.app',
    'http://localhost:3000',
    'https://ets-1yxl0oqw0-sarodemayur55.vercel.app',
    'https://ets-sarodemayur55.vercel.app'
];
  // Website you wish to allow to connect
  if (corsWhitelist.indexOf(req.headers.origin) !== -1) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    // res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
}
  // res.setHeader('Access-Control-Allow-Origin', 'https://ets-9hwzzfgyb-sarodemayur55.vercel.app');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, withCredentials');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error())
    }
  }
  ,credentials: true
}
app.options('*', cors(corsOptions));
// app.use(cookieParser());



// Implementation for Passport
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
require("./config/passportConfig")(passport);
















// app.use("/public",express.static(path.join(__dirname,"public")))
// app.use(cors({origin: 'http://localhost:3000', allowCredentials = "true"}))

app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.use(express.static(path.join(__dirname ,'build')));


app.use("/user", user);
app.use("/course",verifyToken, course);


app.use('/batch',verifyToken,batch); 
app.use('/employee',verifyToken,employee); 
app.get('/getawscreds',async(req,res) => {
  var data={access_key_id,
    secret_access_key}
  
  res.send(data);
})
app.get('*',function(req,res){
  res.sendFile(path.join(__dirname ,'build','index.html'));
});




const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server Listening on ${port}`);
});
