const http = require("http");
const { Server } = require("socket.io");
const Message = require("../models/Message");

function chat(app) {
  const httpServer = http.createServer(app);
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on(
      "private message",
      ({ senderId, recipientId, ceiverId, message }) => {
        const message = new Message({
          senderId,
          ceiverId,
          text: message,
        });
        message.save(function (err) {
          if (err) {
            console.error("Error saving message", err);
          } else {
            const recipientSocket = io.sockets.connected[recipientId];
            if (recipientSocket) {
              recipientSocket.emit("private message", { message: message });
            }
          }
        });
      }
    );

    socket.on("get message history", ({ senderId, ceiverId }) => {
      Message.find({
        $or: [
          { senderId, ceiverId },
          { senderId: ceiverId, ceiverId: senderId },
        ],
      })
        .sort({ createdAt: 1 })
        .exec(function (err, messages) {
          if (err) {
            console.error("Error retrieving messages", err);
          } else {
            socket.emit("message history", { messages: messages });
          }
        });
    });
  });
}

module.exports = chat;
