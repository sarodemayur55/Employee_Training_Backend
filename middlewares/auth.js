const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

const verifyToken = async (req, res, next) => {
  req.user = {};
  
  let token = req.cookies;
  const session_token=token.session_token;
  
  try {
    const decoded = jwt.verify(session_token, JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid token!");
  }
  return next();
};

module.exports = verifyToken;
