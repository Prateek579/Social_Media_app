const Channel = require("../models/channel");
const { cloudinaryImage } = require("../cloudinary/cloudinary");

//creating new Group
const createChannel = async (req, res) => {
  const name = req.body.name;
  const description = req.body.description;
  const type = req.body.type;
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
  if (!name || !type || !description) {
    res
      .status(400)
      .json({ message: "Invalid request. Missing required parameters" });
  } else {
    const channel = await Channel.findOne({ name });
    if (channel) {
      res.status(500).json({ message: "Channel already exist with same name" });
    } else {
      const upload = await cloudinaryImage(dataURI);
      if (upload) {
        const roomId = Math.floor(Math.random() * 999999);
        const newChannel = await Channel.create({
          name,
          admin: req.user.id,
          roomId,
          type,
          members: req.user.id,
          description,
          photo: upload,
        });
        if (newChannel) {
          res.status(200).json({
            message: "New channel created successfully",
            newChannel,
            success: true,
          });
        } else {
          res.status(500).json({ message: "Failed to create New channel" });
        }
      }
    }
  }
};

//adding new client to the GROUP
const addMember = async (req, res) => {
  const { channelId } = req.body;
  const userId = req.user.id;
  try {
    const channel = await Channel.findById(channelId);
    if (channel) {
      const added = await Channel.updateOne(
        { _id: channelId },
        { $push: { members: userId } }
      );
      res.status(200).json({
        success: true,
        message: "New member is added to Group",
        added,
      });
    } else {
      res.status(500).json({ success: false, message: "Channel is not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
    console.log("Error adding member to group", error);
  }
};

//adding the message to the respective group
const addMessage = async (req, res) => {
  const { message, channelId, senderName } = req.body;
  const userId = req.user.id;
  try {
    if (message && channelId) {
      const newMessage = {
        text: message,
        sender: userId,
        senderName: senderName,
      };
      const channel = await Channel.updateOne(
        { _id: channelId },
        { $push: { messages: newMessage } }
      );
      if (channel) {
        res
          .status(200)
          .json({ message: "New message added to the group", channel });
      } else {
        res.status(500).json({ message: "failed to add message in data base" });
      }
    } else {
      res
        .status(400)
        .json({ message: "Invalid request. Missing required parameters" });
    }
  } catch (error) {
    console.log("Error in adding new message", error);
  }
};

//removing the MEMBER from the CHANNEL
const removeMember = async (req, res) => {
  const { channelId } = req.body;
  const userId = req.user.id;
  try {
    if (channelId) {
      const channel = await Channel.updateOne(
        {
          _id: channelId,
        },
        { $pull: { members: userId } }
      );
      if (channel) {
        res.status(200).json({ message: "Member is removed from group" });
      } else {
        res
          .status(500)
          .json({ message: "Failed to remove the member from channel" });
      }
    } else {
      res.status(500).json({ message: "Invalid request. Missing parameters" });
    }
  } catch (error) {
    console.log("Removing the Member error", error);
  }
};

//fetching the user channel list
const userChannel = async (req, res) => {
  const userId = req.user.id;
  try {
    const channelList = await Channel.find({
      admin: userId,
    }).select("-messages -admin -members -roomId");
    if (channelList) {
      res.status(200).json({ success: true, channelList });
    } else {
      res
        .status(400)
        .json({ success: false, message: "User dosen't have any channel" });
    }
  } catch (error) {
    console.log("userChannel server error", error);
  }
};

//updating the CHANNEL LOGO
const channelLogo = async (req, res) => {
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
  const userId = req.user.id;
  try {
    const upload = await cloudinaryImage(dataURI);
    if (upload) {
      const uploaded = await User.findByIdAndUpdate(
        { _id: userId },
        { photo: upload }
      );
      if (uploaded) {
        res.status(200).json({ message: "Profile photo updated successfully" });
      }
    }
  } catch (error) {
    res.send({ succes: false, message: "Logo is not updated try aagain" });
  }
};

//deleting the CHANNEL
const deleteChannel = async (req, res) => {
  const { channelId } = req.body;
  try {
    if (channelId) {
      const channel = await Channel.findById(channelId);
      if (channel.admin == req.user.id) {
        const deleteChannel = await Channel.findByIdAndDelete(channel);
        if (deleteChannel) {
          res.status(200).json({ success: true });
        } else {
          res.status(400).json({ succes: false, message: "Data base error" });
        }
      } else {
        res.status(500).json({
          success: false,
          message: "You are not authorized to delete channel",
        });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Channel id is missing" });
    }
  } catch (error) {
    console.log("deleteChannel error", error);
  }
};

//responding channel all mesages
const channelMessage = async (req, res) => {
  const { channelId } = req.body;
  try {
    if (channelId) {
      const allMessages = await Channel.find({ _id: channelId });

      if (allMessages) {
        res.status(200).json({ success: true, allMessages });
      } else {
        res
          .status(400)
          .josn({ success: false, message: "Data base error try again" });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Please provide a channelId" });
    }
  } catch (error) {
    console.log("channelMessage error", error);
  }
};

//updating the channel messages
const updateMessage = async (req, res) => {
  const { channelId, message, senderName } = req.body;
  const sender = req.user.id;
  const newMessage = {
    text: message,
    sender: sender,
    senderName: senderName,
  };
  try {
    if (channelId !== "" && message !== "") {
      const channel = await Channel.findByIdAndUpdate(
        channelId,
        {
          $push: {
            messages: newMessage,
          },
        },
        { new: true }
      );
      if (channel) {
        res.status(200).json({ success: true, message: "message saved" });
      } else {
        res
          .status(400)
          .json({ success: false, message: "failed to upload message" });
      }
    } else {
      res.status(400).json({ success: false, message: "Please try again" });
    }
  } catch (error) {
    console.log("updateMessage error", error);
  }
};

//searching the channel in data base
const searchChannel = async (req, res) => {
  const { groupSearch } = req.body;
  try {
    if (groupSearch) {
      const channelList = await Channel.find({
        name: { $regex: new RegExp(groupSearch, "i") },
      }).select("_id name photo description");
      if (channelList) {
        res.status(200).json({ success: true, channelList });
      } else {
        res.status(400).json({ success: false, message: "Data base error" });
      }
    } else {
      res
        .status(400)
        .json({ success: false, message: "Please provide channel name" });
    }
  } catch (error) {
    res.status(400).json({ success: false, message: "Server error" });
    console.log("searchChannel error", error);
  }
};

module.exports = {
  createChannel,
  addMember,
  addMessage,
  removeMember,
  userChannel,
  channelLogo,
  deleteChannel,
  channelMessage,
  updateMessage,
  searchChannel,
};
