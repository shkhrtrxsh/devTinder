const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ message: "Profile fetched successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = profileRouter;
