import { createServer } from "http";
import { Server } from "socket.io";
import {
  IChat,
  IConnectedUser,
  ISocketEmitEvent,
  ISocketOnEvent,
  IUser,
} from "./types";
import { User, Chat } from "./models";
import mongoose from "mongoose";

require("dotenv").config();

const httpServer = createServer();

const { SOCKET_SERVER_PORT } = process.env;

const io = new Server<ISocketOnEvent, ISocketEmitEvent>(httpServer, {
  // options
});

const CONNECTED_USERS: IConnectedUser[] = [];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId as string;

  const foundConnUserIdx = CONNECTED_USERS.findIndex(
    (connUser) => connUser.userId === userId
  );

  if (foundConnUserIdx === -1) {
    CONNECTED_USERS.push({
      socketId: socket.id,
      userId,
    });
  } else {
    CONNECTED_USERS[foundConnUserIdx].socketId = socket.id;
  }
  console.log(`Connected: ${socket.id}`);

  // Request receiving chats by user ID
  socket.on("getChatsByUserId", async (userId) => {
    if (!mongoose.isValidObjectId(userId)) {
      socket.emit("getChatsByUserId", {
        success: false,
        message: "User ID is not valid.",
      });
    }
    const chatsData: IChat[] = await Chat.find({
      participants: userId,
    })
      .populate<{ child: IUser }>("participants")
      .populate<{ child: IUser }>("messages.sender")
      .populate<{ child: IUser }>("createdBy");
    socket.emit("getChatsByUserId", { success: true, chatsData });
  });

  // Request receiving chat by ID
  socket.on("getChatById", async (chatId) => {
    if (!mongoose.isValidObjectId(chatId)) {
      socket.emit("getChatById", {
        success: false,
        message: "This chat ID is not valid.",
      });
    }
    const chatData: IChat = await Chat.findOne({
      _id: chatId,
    })
      .populate<{ child: IUser }>("participants")
      .populate<{ child: IUser }>("messages.sender")
      .populate<{ child: IUser }>("createdBy");
    socket.emit("getChatById", { success: true, chatData });
  });

  // New message
  socket.on("sendMessage", async (chatId, newMessage, participantsIds) => {
    try {
      const foundAndUpdatedChat = await Chat.findOneAndUpdate(
        { _id: chatId },
        {
          $push: { messages: newMessage },
        },
        {
          returnOriginal: false,
        }
      )
        .populate<{ child: IUser }>("participants")
        .populate<{ child: IUser }>("messages.sender")
        .populate<{ child: IUser }>("createdBy");
      if (!foundAndUpdatedChat) {
        socket.emit("getChatById", {
          success: false,
          message: "This chat ID is not valid.",
        });
      }

      const connectedRecipients = CONNECTED_USERS.filter((connUser) =>
        participantsIds.some(
          (participiantId) => participiantId === connUser.userId
        )
      );

      if (connectedRecipients.length > 1) {
        connectedRecipients.forEach((connRecipient) =>
          io.to(connRecipient.socketId).emit("getChatById", {
            success: true,
            chatData: foundAndUpdatedChat,
          })
        );
      } else {
        console.log("Send chatData to user");
        socket.emit("getChatById", {
          success: true,
          chatData: foundAndUpdatedChat,
        });
      }
    } catch (e: any) {
      console.error("Error during receiving updated chat: ", e.message);
      socket.emit("getChatById", {
        success: false,
        message: `Error during receiving updated chat: ${e.message}`,
      });
    }
  });

  socket.on("disconnect", () => {
    const foundConnUserIdx = CONNECTED_USERS.findIndex(
      (connUser) => connUser.socketId === socket.id
    );
    if (foundConnUserIdx) {
      CONNECTED_USERS.splice(foundConnUserIdx, 1);
    }
    console.log(`Disconnected: ${socket.id}`);
  });
});

export const startSocketServer = () => {
  httpServer.listen(SOCKET_SERVER_PORT);
  console.log("Socket server started on port ", SOCKET_SERVER_PORT);
};
