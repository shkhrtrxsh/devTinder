const express = require("express");
const userRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

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

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequestModel.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId);
      hideUsersFromFeed.add(req.toUserId);
    });
    // find all the users except the users to be hidden
    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    }).select("firstName lastName age photoUrl skills");

    res.status(200).json({ message: "Feed", users });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = userRouter;
