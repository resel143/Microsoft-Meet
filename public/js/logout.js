function logout() {
  firebase
    .auth()
    .signOut()
    .then(function() {
      console.log("Logout Successfull!!");
      localStorage.removeItem("name");
      localStorage.removeItem("username");
      localStorage.removeItem("userrole");
      localStorage.removeItem("downloadurl");
      localStorage.removeItem("key");
      window.location.replace("./signin.html");
    })
    .catch(function(error) {
      console.log(error);
    });
}
