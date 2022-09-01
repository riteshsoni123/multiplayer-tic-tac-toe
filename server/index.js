require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const cors = require("cors");

connectDB();

const PORT = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

app.use("/game", require("./routes/game"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/private", require("./routes/private"));

// Error Handler
app.use(errorHandler);

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  const id = socket.handshake.query.senderId;
  socket.join(id);

  socket.on("sendData", (data) => {
    socket.broadcast.to(data.id).emit("recieveData", data);
  });

  socket.on("sendCoinToss", (data) => {
    socket.broadcast.to(data.id).emit("recieveCoinToss", data.value);
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
