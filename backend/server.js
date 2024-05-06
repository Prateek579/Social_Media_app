const express = require("express");
const cors = require("cors");
const userRouter = require("./router/user");
const bodyParser = require("body-parser");
const connectDb = require("./connection/db");
const channelRouter = require("./router/channel");
const postRouter = require("./router/post");

const { createServer } = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

// Creating an instance of Express
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer);

connectDb();
app.use(cors({ origin: process.env.CLIENT_PORT }));

//Defining the PORT
const PORT = process.env.PORT || 8010;

app.use(bodyParser.json());

app.use("/api/user", userRouter);
app.use("/api/channel", channelRouter);
app.use("/api/post", postRouter);

// Define a route for the homepage
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Define a route for handling 404 errors
app.use((req, res, next) => {
  res.status(404).send("Sorry, can't find that!");
});

//implementing socket.io server
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  // Handle join room event
  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("new member", (room, name) => {
    console.log("new member", room, name);
    socket.in(room).emit("joined member", name);
  });

  // Handle chat message event
  socket.on("new message", (room, data) => {
    // Save message to database (if needed)
    socket.in(room).emit("receive message", data); // Broadcast message to all users in the room
  });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
