function signupp(email, password, name, id, branch, role) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then(function() {
      console.log("SignUp Success!!!");
    })
    .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });

  firebase
    .database()
    .ref("users/")
    .push({
      email: email,
      name: name,
      userID: id,
      branch: branch,
      role: role
    })
    .then(function() {
      alert("User Added");
      window.location.replace("./signin.html");
    });
}
