const mongoose = require('mongoose');


const chatSchema = new mongoose.Schema({
    message:{
        type:String
    },
    sender:{
        typr:String
    },
},{
    timestamp:true
});

const Chat = mongoose.model('Chat',chatSchema);
module.exports = Chat;