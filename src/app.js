import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const PORT = 8080;

app.engine("handlebars", handlebars.engine());
app.set("views", "./src/views");
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.render("index");
});

const httpServer = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});



let messages = [];
const io = new Server(httpServer);

io.on("connection", (socket) => {
  console.log(`Nuevo cliente conectado con el id ${socket.id}`);

  socket.on("newUser", (data) => {
    socket.broadcast.emit("newUser", data);
  });

  socket.on("message", (data) => {
    messages.push(data);
    io.emit("messageLogs", messages);
  });
});

io.on('connection', async (socket) => {
  console.log('a user connected')

  socket.on('chat message', async (msg) => {
    // ...
  })

  if (!socket.recovered) {
    try {
      const results = await db.execute({
        sql: `SELECT id, content FROM messages WHERE id > ?`,
        args: [socket.handshake.auth.serverOffset ?? 0]
      })

      results.rows.forEach(row => {
        socket.emit('chat message', row.content, row.id)
      })
    } catch (e) {
      console.error(e)
    }
  }
});