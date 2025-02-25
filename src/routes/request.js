const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    res.send(req.user.firstName);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = requestRouter;
