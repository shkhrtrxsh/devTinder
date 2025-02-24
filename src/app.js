require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const app = express();
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

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
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error("Invalid credentials");
    } else {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
      res.cookie("token", token);
      res.status(200).json({ message: "Login successful" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;

    //validate the token
    const isTokenValid = jwt.verify(token, process.env.JWT_SECRET);
    const { userId } = isTokenValid;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    } else {
      res.status(200).json({ message: "Profile fetched successfully", user });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete({ _id: userId });
    res.send("User deleted");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//patch request to update the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const updatedUser = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "gender",
      "age",
      "photoUrl",
      "about",
      "skills",
    ];
    const updates = Object.keys(req.body);
    const isUpdateAllowed = updates.every((update) =>
      ALLOWED_UPDATES.includes(update)
    );
    if (!isUpdateAllowed) {
      throw new Error("Invalid updates!");
    }
    if (updatedUser.skills.length > 10) {
      throw new Error("Skills must be less than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, updatedUser, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send(user);
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
