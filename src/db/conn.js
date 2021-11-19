const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/OnlineClasses",{
    useNewUrlParser:true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=> {console.log("Connection to Database successfull")})
.catch(()=>{console.log(`Unable to connect to DB :(`)});