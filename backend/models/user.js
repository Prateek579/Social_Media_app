const mongoose = require("mongoose");
const moment = require("moment-timezone");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    avatar: String,
    status: String,
  },
  createdAt: {
    type: Date,
    default: () => moment().tz("Asia/Kolkata").format(),
  },
});

module.exports = mongoose.model("User", userSchema);
