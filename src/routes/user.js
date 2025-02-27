const express = require("express");
const userRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");

// get all the pending connection request for the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequestModel.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "age",
      "photoUrl",
      "skills",
    ]);
    res.status(200).json({ message: "Requests", requests });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequestModel.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "photoUrl",
        "skills",
      ])
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "photoUrl",
        "skills",
      ]);
    const data = requests.map((row) => {
      const user = row.toUserId.equals(loggedInUser._id)
        ? row.fromUserId
        : row.toUserId;
      return {
        name: user.firstName + " " + user.lastName,
        age: user.age,
        photoUrl: user.photoUrl,
        skills: user.skills,
      };
    });
    res.status(200).json({ message: "Requests", data });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
