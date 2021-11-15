const socket = io("/");
const video_grid = document.getElementById("video-grid");
let myVideoStream;
const myVideo = document.createElement("video");
myVideo.muted = true;

const user = prompt("Enter name: ");
var peer = new Peer(undefined, {
    path: "/peerjs",
    host: "/",
    port: PORT,
});


navigator.mediaDevices
    .getUserMedia({
        audio: true,
        video: true,
    })
    .then((stream) => {
        console.log("streaming video : adding video");
        myVideoStream = stream;
        addVideoStream(myVideo, stream);
        peer.on("call", (call) => {
            console.log("answer a call");
            call.answer(stream);
            const video = document.createElement("video");
            call.on("stream", (userVideoStream) => {
                console.log("video stream on calling");
                addVideoStream(video, userVideoStream);
            });
        });
        socket.on("user-connected", (userId) => {
            console.log("user is connected");
            connectToNewUser(userId, stream);
        });
    });

const connectToNewUser = (userId, stream) => {
    console.log("connectToNewUser: Connected to new user");    
    setTimeout(() => {
        const call = peer.call(userId, stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
            console.log("users video stream");
            addVideoStream(video, userVideoStream);
        });
    }, 1000);
};

peer.on("open", (id) => {
    console.log("on joining room id of peer " + id);
    socket.emit("join-room", ROOM_ID, id);
});

const addVideoStream = (video, stream) => {
    console.log("addvideostream: add video stream");
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        console.log("listener video");
        video.play();
        video_grid.append(video);
    });
};

let text = document.querySelector("#chat_message");
let send = document.getElementById("send");
let messages = document.querySelector(".messages");

send.addEventListener("click", (e) => {
    if (text.value.length !== 0) {  //if message is not empty
      socket.emit("sendMessage", ROOM_ID, text.value, user);  // display message
      text.value = "";
    }
  });

text.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && text.value.length !== 0) {
      socket.emit("sendMessage", ROOM_ID, text.value, user);
      text.value = "";
    }
  });
  
const inviteButton = document.querySelector("#inviteButton");
const muteButton = document.querySelector("#muteButton");
const stopVideo = document.querySelector("#stopVideo");

muteButton.addEventListener("click", () => {
  const enabled = myVideoStream.getAudioTracks()[0].enabled;
  if (enabled) {
    myVideoStream.getAudioTracks()[0].enabled = false;
    html = `<i class="fas fa-microphone-slash"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  } else {
    myVideoStream.getAudioTracks()[0].enabled = true;
    html = `<i class="fas fa-microphone"></i>`;
    muteButton.classList.toggle("background__red");
    muteButton.innerHTML = html;
  }
});

stopVideo.addEventListener("click", () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      html = `<i class="fas fa-video-slash"></i>`;
      stopVideo.classList.toggle("background__red");
      stopVideo.innerHTML = html;
    } else {
      myVideoStream.getVideoTracks()[0].enabled = true;
      html = `<i class="fas fa-video"></i>`;
      stopVideo.classList.toggle("background__red");
      stopVideo.innerHTML = html;
    }
  });

  inviteButton.addEventListener("click", (e) => {
    prompt(
      "Share URL",
      window.location.href
    );
  });
  
  socket.on("createMessage", (message, userName) => {
    console.log("createMessage " + message + " " + userName);
    messages.innerHTML =
      messages.innerHTML +
      `<div class="message">
          <b><i class="far fa-user-circle"></i> <span> ${
            userName === user ? "Me" : userName
          }</span> </b>
          <span>${message}</span>
      </div>`;
  });
  