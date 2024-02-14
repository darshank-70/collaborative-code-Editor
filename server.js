const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app); //http server
const io = new Server(server); //upgrading to io server

io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("running on port", PORT);
});
