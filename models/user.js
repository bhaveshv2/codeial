const mongoose = require('mongoose');
const multer = require('multer');

const path=require('path');
const AVATAR_PATH = path.join('/uploads/users/avatars');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    avatar:{
        type:String,

    },
    //store the friendship whether we have to sent or receive the request in this array
    friends: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    sentRequests: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ],
    receivedRequests: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, {
    timestamps: true
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {                                 //destination is used to determine within which folder the uploaded files should be stored. This can also be given as a string (e.g. '/tmp/uploads'). If no destination is given, the operating system's default directory for temporary files is used.
      cb(null, path.join(__dirname,'..',AVATAR_PATH))
    },                                                                       
    filename: function (req, file, cb) {                                    //filename is used to determine what the file should be named inside the folder. If no filename is given, each file will be given a random name that doesn't include any file extension.
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix);
    }
});

//Static functions (oops concept) uploadedAvatar is the static function
userSchema.statics.uploadedAvatar = multer({storage:storage}).single('avatar');             //single is use as only one instance or one file is uploaded at a time

userSchema.statics.avatarPath = AVATAR_PATH;                                                //function for upload at this storage (directly accessable and available publicly that's why this function is made)


const User = mongoose.model('User', userSchema);

module.exports = User;