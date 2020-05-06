const mongoose = require('mongoose');

const unlikeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId,
    },
    //this defines the object id of the unliked object
    unlikeable:{
        type:mongoose.Schema.ObjectId,
        required:true,
        refPath:'onModel'
    },
    //this field is used for defining the type of the unliked Object since this is a dynamic reference
    onModel:{
        type:String,
        required:true,
        enum:['Post','Comment']             //enum tells the value of onModel is like either belongs to Post or Comment  
    }
},{
    timestamps:true
});

const Unlike = mongoose.model('Unlike',unlikeSchema);
module.exports = Unlike;