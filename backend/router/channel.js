const express = require("express");
const authUser = require("../middleware/userAuth");
const {
  createChannel,
  addMember,
  addMessage,
  removeMember,
  userChannel,
  deleteChannel,
  channelMessage,
  updateMessage,
  searchChannel,
} = require("../controller/channelController");
const multer = require("multer");

const channelRouter = express.Router();

const storage = new multer.memoryStorage();
const upload = multer({
  storage,
});

channelRouter.post(
  "/createChannel",
  upload.single("photo"),
  authUser,
  createChannel
);
channelRouter.put("/addMember", authUser, addMember);
channelRouter.put("/newMessage", authUser, addMessage);
channelRouter.delete("/removeMember", authUser, removeMember);
channelRouter.get("/userChannels", authUser, userChannel);
channelRouter.delete("/deleteChannel", authUser, deleteChannel);
channelRouter.post("/channelMessages", channelMessage);
channelRouter.put("/updateMessage", authUser, updateMessage);
channelRouter.post("/searchChannel", searchChannel);

module.exports = channelRouter;
