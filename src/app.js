require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");
app.use(cookieParser());
app.use(express.json());

app.post("/signup", async (req, res) => {
  try {
    // validation of data
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;
    // encrypting the password
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.status(200).json({ message: "Login successful" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ message: "Profile fetched successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    res.send(req.user.firstName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

connectDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
