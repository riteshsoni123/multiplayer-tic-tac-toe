const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/game", require("./routes/game"));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  socket.on("sendData", (data) => {
    socket.broadcast.to(data.joinCode).emit("recieveData", data);
  });

  socket.on("sendCoinToss", (data) => {
    socket.broadcast.to(data.joinCode).emit("recieveCoinToss", data);
  });

  socket.on("create_room", (roomId) => {
    socket.join(roomId);
  });

  socket.on("join_room", (roomId) => {
    socket.join(roomId);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
