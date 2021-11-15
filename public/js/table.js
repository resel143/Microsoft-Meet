(function() {
  /*const config = {
    //YOUR CONFIGS
  };

  firebase.initializeApp(config);*/
  const myTable = document.getElementById("myTable");
  const dbmyTableRef = firebase
    .database()
    .ref()
    .child("myTable");
  dbmyTableRef.on("value", snap => (myTable.innerText = snap.val()));

  var table = document.querySelector("#table1 tbody");
  const dbdataRef = firebase
    .database()
    .ref()
    .child("data");
  dbdataRef.on("value", snap => {
    while (table.hasChildNodes()) {
      table.removeChild(table.firstChild);
    }

    var students = snap.val();
    for (var i in students) {
      var row = table.insertRow(-1);
      for (var j in students[i]) {
        cell1 = row.insertCell(0);
        cell1.innerHTML = students[i][j].subject;

        cell2 = row.insertCell(1);
        cell2.innerHTML = students[i][j].description;

        cell3 = row.insertCell(2);
        cell3.innerHTML = students[i][j].type;

        cell4 = row.insertCell(3);
        cell4.innerHTML = students[i][j].userID;

        cell5 = row.insertCell(4);
        cell5.innerHTML = students[i][j].uploadBy;

        cell6 = row.insertCell(5);
        cell6.innerHTML = students[i][j].uploadedOn;

        cell7 = row.insertCell(6);
        cell7.innerHTML = "<a "+ "href="+students[i][j].downloadURL + ">" +"Download" + "</a>";
      }
    }
  });
})();
