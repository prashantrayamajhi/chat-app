const path = require("path");
const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

const { formatMessage } = require("./utils/messages");
const { userJoin, getCurrentUser, userLeave } = require("./utils/users");

// set static folder
app.use(express.static(path.join(__dirname, "./public")));

// run when a client connects
io.on("connection", (socket) => {
  socket.on("join", (username, callback) => {
    const { error, user } = userJoin(socket.id, username);
    if (error) {
      return callback(error);
    }
    socket.emit(
      "message",
      formatMessage("bot", `Welcome aboard ${user.username} `)
    );

    socket.broadcast.emit(
      "message",
      formatMessage("bot", `${user.username} has joined the chat`)
    );
  });

  socket.on("message", (message) => {
    message = message.trim();
    if (message.length > 0) {
      const user = getCurrentUser(socket.id);
      if (user) {
        io.emit("message", formatMessage(user.username, message));
      }
    }
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.emit(
        "message",
        formatMessage("bot", `${user.username} has left the chat`)
      );
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
