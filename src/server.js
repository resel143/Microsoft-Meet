const express = require("express");
const app = express();
const path = require("path");
const server = require("http").Server(app);

const { v4: uuidV4 } = require('uuid')
const io = require("socket.io")(server);
app.use(express.static('public'))

// database requirement
require("./db/conn");

// required model
const newPerson =  require("./models/user");



// static public folder rendering
const static_path = path.join(__dirname,"../public");

app.use(express.static(static_path));
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.set('view engine', 'ejs');

const { ExpressPeerServer } = require("peer");
const { resolveSoa } = require("dns");
const newUser = require("./models/user");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.get("/", (req, res) => {
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


// login form - signup

app.post("/register",async(req,res)=>{
  // console.log(req.body);
  try{
    const addUser = new newPerson({
      name: req.body.name,
      userId: req.body.id,
      password: req.body.password,
      email: req.body.email,
      branch: req.body.branch,
      job: req.body.job,
      login: "0",
    });

    const addedUser = await addUser.save();
    res.status(201).send("Signin Successfull");

  }catch(err){
    res.status(400).send("Invalid Request! Try Again");
  }
})

// login form singin

app.post("/login",async(req,res)=>{
    newPerson.find({},(err,item)=>{
      item.map(i =>{
        if(i.userId === req.body.name && i.password === req.body.password){
          console.log(`User Found!`);
          newPerson.updateOne({_id:i._id},{$set:{login:"1"}}).then(()=>{console.log("Signed In")});
          if(i.job === "Student"){
            res.render("stud");
          }else{
            res.render("teacher");
          }
        }else{console.log("Fake User");}
        }
      )
    })
})

// app.use(express.static("public"));

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


