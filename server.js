const express = require("express");
const app = express();
const server = require("http").Server(app);
app.set('view engine', 'ejs')
const { v4: uuidV4 } = require('uuid')
const io = require("socket.io")(server);
app.use(express.static('public'))

const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.get("/", (req, res) => {
  // res.redirect(`/${uuidV4()}`);
  res.render("signin");
});


app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/meet", (req, res) => {
   res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room , port: (process.env.PORT || 80)})
})

app.use("/peerjs", peerServer);

app.use(express.static("public"));

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);
  });

  socket.on("sendMessage", (roomId, message, userName) => {
    console.log("on sendMessage: " + roomId + " " + message + " " + userName);
    io.to(roomId).emit("createMessage", message, userName);
  })
});
server.listen(process.env.PORT || 3000);


