const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    //read the token from the req cookies
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      return res.status(401).json({ message: "Please login to continue" });
    }
    //validate the token
    const isTokenValid = jwt.verify(token, "DEV@Tinder$790");
    const { userId } = isTokenValid;
    //find the user
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send("message: " + error.message);
  }
};

module.exports = { userAuth };
