const User = require("../models/User");
const bcrypt = require("bcryptjs");
const localStrategy = require("passport-local").Strategy;
const { createHmac } = require("crypto");
const secret = process.env.PASSWORD_SECRET;


module.exports = function (passport) {
  passport.use(
    new localStrategy((username, password, done) => {

      User.findOne({ email },(err,user)=>{
        if (err) throw err;
        if (!user) return done(null, false);
        const hash = createHmac("sha256", secret).update(password).digest("hex");
        if (user.password !== hash) {
            return done(null, false);
          }
          else
          {
            return done(null, user);
          }
      })

    })
  );

  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser((id, cb) => {
    User.findOne({ _id: id }, (err, user) => {
      const userInformation = {
        username: user.username,
      };
      cb(err, userInformation);
    });
  });
};