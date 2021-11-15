function login(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(function() {
      console.log("Login Done!");

      firebase
        .database()
        .ref("users/")
        .orderByChild("email")
        .equalTo(email)
        .on("value", function(snapshot) {
          snapshot.forEach(function(data) {
            localStorage.setItem("key", data.key);
            console.log(data.key);
          });
          console.log(snapshot.val()[localStorage.getItem("key")].name);
          localStorage.setItem(
            "username",
            snapshot.val()[localStorage.getItem("key")].name
          );
          localStorage.setItem(
            "userrole",
            snapshot.val()[localStorage.getItem("key")].role
          );

          if (snapshot.val()[localStorage.getItem("key")].role == "Teacher") {
            window.location.replace("./dashboard-teacher.html");
          } else {
            window.location.replace("./dashboard-student.html");
          }
        });
    })
    .catch(function(error) {
      // Handle Errors here.
      //   alert("login error");
      var errorCode = error.code;
      var errorMessage = error.message;
        alert(errorMessage);
      console.log(errorCode);
      console.log(errorMessage);

      // ...
    });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    var displayName = user.displayName;
    var email = user.email;
    var emailVerified = user.emailVerified;
    var photoURL = user.photoURL;
    var isAnonymous = user.isAnonymous;
    var uid = user.uid;
    var providerData = user.providerData;
    // ...
    console.log(uid);
  } else {
    // User is signed out.
    // ...
  }
});
