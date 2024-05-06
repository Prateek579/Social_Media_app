const mongoose = require("mongoose");
const moment = require("moment-timezone");

const postSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  photos: [String],
  likedBy:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  timestamp: {
    type: Date,
    default: () => moment().tz('Asia/Kolkata').format(),
  },
});

module.exports = mongoose.model("Post", postSchema);
