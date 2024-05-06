const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
});

const cloudinaryImage = async (image) => {
  try {
    const cloud = await cloudinary.uploader.upload(image, {
      folder: "startup-images",
    });
    return cloud.secure_url;
  } catch (error) {
    console.log("something wrong cloudinary", error.message);
  }
};

const cloudinaryVideo = async (video) => {
  try {
    const result = await cloudinary.uploader.upload(video, {
      resource_type: "video",
      folder: "startup-images",
      eager: [
        { width: 300, height: 300, crop: "pad", audio_codec: "none" },
        {
          width: 160,
          height: 100,
          crop: "crop",
          gravity: "south",
          audio_codec: "none",
        },
      ],
      eager_async: true,
    });
    return result.secure_url;
  } catch (error) {
    console.log("Something wrong in video uploading", error);
  }
};

module.exports = { cloudinaryImage, cloudinaryVideo };
