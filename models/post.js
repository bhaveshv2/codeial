const mongoose = require('mongoose');
const multer = require('multer');

const path=require('path');
const IMAGE_PATH = path.join('/uploads/posts/images');


const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //include array of ids of all the comments in this post schema itself
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'
        }
    ],
    likes:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Like'
        }
    ]   
},{
    timestamps: true
});




const Post = mongoose.model('Post', postSchema);
module.exports = Post;