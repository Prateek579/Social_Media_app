const { cloudinaryImage } = require("../cloudinary/cloudinary");
const Post = require("../models/post");

// creating function for new POST
const newPost = async (req, res) => {
  const b64 = Buffer.from(req.file.buffer).toString("base64");
  let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
  const title = req.body.title;
  try {
    if (!title || !dataURI) {
      res.status(400).json({ message: "Title or Image is missing" });
    } else {
      const upload = await cloudinaryImage(dataURI);
      if (upload) {
        const creatPost = await Post.create({
          createdBy: req.user.id,
          title,
          photos: upload,
        });
        if (creatPost) {
          res.status(200).json({ success: true });
        } else {
          res.status(400).json({ success: false, message: "Data base error" });
        }
      } else {
        res.status(400).json({
          success: false,
          message: "Something went wrong please try again",
        });
      }
    }
  } catch (error) {
    console.log("new post error", error);
  }
};

//returning back to user with their all USER POSTS
const userPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({ createdBy: req.user.id });
    if (allPosts) {
      res.status(200).json({ success: true, allPosts });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Data base error try again" });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Something went wrong please try again",
    });
  }
};

//responding the all posts
const allPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({});
    if (allPosts) {
      res.status(200).json({ success: true, allPosts });
    } else {
      res
        .status(400)
        .json({ success: false, message: "Data base error try again" });
    }
  } catch (error) {
    console.log("allPosts errro", error);
  }
};

//update the POST LIKES
const likePost = async (req, res) => {
  const { postId } = req.body;
  const user = req.user.id;
  try {
    if (postId) {
      const liked = await Post.findByIdAndUpdate(
        postId,
        { $set: { likedBy: user } },
        { new: true }
      );
      if (liked) {
        res.status(200).json({ success: true, messsage: "Updated like"});
      } else {
        res
          .status(400)
          .json({ success: false, message: "data base error try again" });
      }
    } else {
      res.status(400).json({ success: false, message: "Post id is empty" });
    }
  } catch (error) {
    console.log("likePost error", error);
  }
};

module.exports = {
  newPost,
  userPosts,
  allPosts,
  likePost,
};
