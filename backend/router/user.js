const express = require("express");
const {
  createUser,
  updateUserProfile,
  loginUser,
  sendCode,
  resetPassword,
} = require("../controller/userController");
const authUser = require("../middleware/userAuth");

const userRouter = express.Router();

userRouter.post("/createUser", createUser);
userRouter.post("/loginUser", loginUser);
userRouter.put("/updateProfile", authUser, updateUserProfile);
userRouter.put("/sendCode", sendCode);
userRouter.put("/resetPassword", resetPassword);

module.exports = userRouter;
