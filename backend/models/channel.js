const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema({
  name: { type: String, index: true },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  roomId: Number,
  type: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  description: String,
  messages: [
    {
      text: String,
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      senderName: String,
    },
  ],
  photo: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Channel", channelSchema);
