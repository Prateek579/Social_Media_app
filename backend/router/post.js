const express = require("express");
const authUser = require("../middleware/userAuth");
const {
  newPost,
  userPosts,
  allPosts,
  likePost,
} = require("../controller/postController");
const multer = require("multer");

const postRouter = express.Router();

const storage = new multer.memoryStorage();
const upload = multer({
  storage,
});

postRouter.post("/newPost", upload.single("photo"), authUser, newPost);
postRouter.get("/userPosts", authUser, userPosts);
postRouter.get("/allPosts", allPosts);
postRouter.put("/likePost", authUser, likePost);

module.exports = postRouter;
