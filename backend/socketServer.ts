import { createServer } from "http";
import { Server } from "socket.io";

require("dotenv").config();

const httpServer = createServer();

const { SOCKET_SERVER_PORT } = process.env;

const io = new Server(httpServer, {
  // options
});

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.id}`);
  });
});

const start = () => {
  httpServer.listen(SOCKET_SERVER_PORT);
  console.log("Socket server started on port ", SOCKET_SERVER_PORT);
};

start();
