const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../model/userSchema')

dotenv.config({ path: './config.env' });

const mid = async (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    var env = process.env.SECRET_KEY;
    const verifyToken = jwt.verify(token, env);


    const rootUser = await User.findOne({ _id: verifyToken._id, "tokens.token": token });
    if (!rootUser) {
      throw new Error("User not found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;
    console.log("hello");
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = mid;
