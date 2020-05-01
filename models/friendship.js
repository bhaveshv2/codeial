const mongoose = require('../config/mongoose');

const friendshipSchema = new mongoose.Schema({
    //the user who sent the request
    from_user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    },
    //the user who accepeted this request
    to_user:{
        type:mongoose.Schema.ObjectId,
        ref:'User'
    }
},{
    timestamps:true
});

const Friendship = mongoose.model('Friendship',friendshipSchema);
module.exports = Friendship;