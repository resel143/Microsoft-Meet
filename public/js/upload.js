function upload(subject, type, description) {
  firebase
    .database()
    .ref("data/" + subject)
    .push({
      Type: type,
      Description: description,
      //userID: id,
      //uploadBy: by,
      uploadedOn: moment().format("dddd, MMMM Do YYYY, h:mm:ss a")
    });
}
