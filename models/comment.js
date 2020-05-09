const mongoose=require('mongoose');

const commentSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true
    },

    //comments belongs to the a user
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },

    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    likes:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Like'
        }
    ],
    unlikes:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Unlike'
        }
    ],
},{
    timestamps:true,
});

const Comment = mongoose.model('Comment',commentSchema);

module.exports = Comment;