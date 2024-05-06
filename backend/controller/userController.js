// Import necessary modules and models
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

// Function to create a new user
const createUser = async (req, res) => {
  const { name, email, password } = req.body;
  // Check if all required fields are provided
  if (!name || !email || !password) {
    res.status(400).json({ message: "All fields are mandatory" });
  } else {
    // Check if a user with the provided email already exists
    const userExist = await User.findOne({ email });
    if (!userExist) {
      // Hash the password using bcrypt
      const hashedPassword = await bcrypt.hash(password, 10);

      try {
        const createUser = await User.create({
          name,
          email,
          password: hashedPassword,
        });

        // Generate a JWT token for the newly created user
        const data = {
          id: createUser.id,
        };
        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        res.status(200).json({
          authToken,
          name: createUser.name,
          success: true,
          id: createUser.id,
        });
      } catch (error) {
        res.status(400).json({ message: "User creation error" });
      }
    } else {
      res.status(400).json({ message: "User already exists with this email" });
    }
  }
};

// Function for updating the user profile
const updateUserProfile = async (req, res) => {
  const { avatar, status } = req.body;
  const userId = req.user.id;
  // Check if all required fields are provided
  if (!avatar || !status) {
    res.status(400).json({ message: "All fields are mandatory" });
  } else {
    // Check if a user with the provided email already exists
    const user = await User.findById(userId);
    if (user) {
      try {
        user.profile.avatar = avatar;
        user.profile.status = status;
        await user.save();
        res.status(200).json({ message: "Profile data updated", user });
      } catch (error) {
        res.status(400).json({ message: "Profile update error" });
      }
    } else {
      res.status(400).json({ message: "User is not exist" });
    }
  }
};

// // creating new post
// const newPost = async (req, res) => {
//   const b64 = Buffer.from(req.file.buffer).toString("base64");
//   let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
//   let upload;
//   try {
//     upload = await cloudinaryImage(dataURI);
//   } catch (error) {
//     res.send({ succes: false, message: "Image is not uploaded on cloudinary" });
//   }
//   const userId = req.user.id;
//   if (!upload) {
//     res.status(400).json({ message: "The image url is not available" });
//   } else {
//     try {
//       //this will find the user with id and update the profile photo path
//       const uploaded = await Images.create({
//         user: userId,
//         photo: upload,
//       });
//       res.status(200).json({ message: "Image posted successfully" });
//     } catch (error) {
//       res
//         .status(400)
//         .json({ message: "userProfile internal server error", error });
//     }
//   }
// };

//creating function for LOGIN user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email && password) {
      const userExist = await User.findOne({ email });
      if (userExist) {
        const isCorrectPassword = await bcrypt.compare(
          password,
          userExist.password
        );
        if (isCorrectPassword) {
          // Generate a JWT token for the newly created user
          const data = {
            id: userExist.id,
          };
          const authToken = jwt.sign(data, process.env.JWT_SECRET);
          res.status(200).json({
            name: userExist.name,
            authToken,
            success: true,
            id: userExist.id,
          });
        } else {
          res
            .status(400)
            .json({ message: "Please enter correct password", success: false });
        }
      } else {
        res
          .status(400)
          .json({ message: "User does not exist", success: false });
      }
    } else {
      res
        .status(400)
        .json({ message: "All field are mendatory", success: false });
    }
  } catch (error) {
    console.log("Reset password error", error);
  }
};

//sending the OTP to the user
const sendCode = async (req, res) => {
  const { email } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    const passwordCode = Math.floor(Math.random() * 900000) + 100000;
    let config = {
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    };

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Startup",
        link: "https://mailgen.js",
      },
    });

    let response = {
      body: {
        name: "",
        intro: userExist.name,
        table: {
          data: [
            {
              discription: "The OTP for password reset",
              code: passwordCode,
            },
          ],
        },
        outro: "Thankyou for join us",
      },
    };

    let mail = MailGenerator.generate(response);

    let message = {
      from: process.env.EMAIL,
      to: email,
      subject: "Reset Password",
      html: mail,
    };

    transporter
      .sendMail(message)
      .then(() => {
        return res.status(201).json({ code: passwordCode, success: true });
      })
      .catch((error) => {
        return res
          .status(500)
          .json({ success: false, error, message: "OTP error" });
      });
  } else {
    return res
      .status(200)
      .json({ message: "User does not exist", success: false });
  }
};

//update the user password in database
const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res
      .status(400)
      .json({ message: "Not sended email or reset password", success: false });
  } else {
    const userExist = await User.findOne({ email });
    if (userExist) {
      const _id = userExist._id;
      const hashedPassword = await bcrypt.hash(password, 10);
      try {
        const update = await User.findByIdAndUpdate(
          { _id },
          { password: hashedPassword }
        );
        res.status(200).json({
          success: true,
        });
      } catch (error) {
        res.status(400).json({
          message: "Reset password internal server error",
          success: false,
        });
      }
    } else {
      res.status(400).json({
        message: "User does not exist with this email",
        success: false,
      });
    }
  }
};

// Export the createUser function
module.exports = {
  createUser,
  updateUserProfile,
  loginUser,
  sendCode,
  resetPassword,
};
