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
  socket.on("join", (username) => {
    const user = userJoin(socket.id, username);
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
  // socket.on("join", (username) => {
  //   const user = userJoin(socket.id, username);
  //   // welcome current user
  //   socket.emit(
  //     "message",
  //     formatMessage(undefined, `Welcome ${user.username}`)
  //   );
  //   // broadcasts when a user joins the chat
  //   socket.broadcast.emit(
  //     "message",
  //     formatMessage("Admin", `${user.username} has joined the chat`)
  //   );
  //   io.emit("roomUsers", {
  //     room: user.room,
  //     users: getRoomUsers(user.room),
  //   });
  // });
  // // handle conversation
  // socket.on("message", (msg) => {
  //   const user = getCurrentUser(socket.id);
  //   if (user) {
  //     io.emit("message", formatMessage("Prashant", msg));
  //   } else {
  //     return {
  //       error: "",
  //     };
  //   }
  // });
  // // runs when the client disconnets
  // socket.on("disconnect", () => {
  //   const user = userLeave(socket.id);
  //   if (user) {
  //     io.emit(
  //       "message",
  //       formatMessage(undefined, `${user.username} has left the chat`)
  //     );
  //     io.emit("roomUsers", {
  //       room: user.room,
  //       users: getRoomUsers(user.room),
  //     });
  //   }
  // });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
