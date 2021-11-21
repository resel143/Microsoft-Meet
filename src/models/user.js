const mongoose = require("mongoose");

const newSchema = new mongoose.Schema({
    userId:{
        type:String,
        require:true
    },
    name:{
        type: String
    },
    password:{
        type:String,
        require:true
    },
    email:{
        type:String
    },
    branch:{
        type:String
    },
    job:{
        type:String
    },
    login: {
        type: String
    }
});

const newUser = new mongoose.model("user",newSchema);

module.exports = newUser;