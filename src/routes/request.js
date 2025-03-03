const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const ConnectionRequestModel = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status: req.params.status,
      });
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(req.params.status)) {
        return res
          .status(400)
          .json({ message: "Invalid status", allowedStatus });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User not found!" });
      }

      const isRequestAlreadySent = await ConnectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (isRequestAlreadySent) {
        return res.status(400).json({ message: "Request already sent" });
      }
      const data = await connectionRequest.save();

      res.status(201).json({
        message: `${req.user.firstName} ${req.params.status} ${toUser.firstName}`,
        data,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      //validate the status
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(req.params.status)) {
        return res
          .status(400)
          .json({ message: "Invalid status", allowedStatus });
      }
      // validate the requestId
      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: req.params.requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection Request not found" });
      }

      const status = req.params.status;

      connectionRequest.status = status;
      const data = await connectionRequest.save();

      res.status(200).json({ message: `Request ${status}`, data });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = requestRouter;
