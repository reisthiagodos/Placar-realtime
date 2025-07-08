const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: { origin: "*" }
});

let players = [];

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.emit("update", players);

  socket.on("add", ({ name, points }) => {
    const existing = players.find(p => p.name === name);
    if (existing) {
      existing.score += points;
    } else {
      players.push({ name, score: points });
    }
    io.emit("update", players);
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
