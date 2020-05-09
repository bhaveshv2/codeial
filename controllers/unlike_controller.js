const Unlike = require("../models/unlike");
const Post =  require("../models/post");
const Comment = require('../models/comment');


module.exports.toggleUnlike = async function(req, res){
    try{

        // likes/toggle/?id=abcdef&type=Post
        let unlikeable;
        let deletedUnlike = false;


        if (req.query.type == 'Post'){
            unlikeable = await Post.findById(req.query.id).populate('unlikes');
        }else{
            unlikeable = await Comment.findById(req.query.id).populate('unlikes');
        }


        // check if a like already exists
        let existingUnlike = await Unlike.findOne({
            unlikeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        })

        // if a like already exists then delete it
        if (existingUnlike){
            unlikeable.unlikes.pull(existingUnlike._id);
            unlikeable.save();

            existingUnlike.remove();
            deletedUnlike = true;

        }else{
            // else make a new like

            let newUnlike = await Unlike.create({
                user: req.user._id,
                unlikeable: req.query.id,
                onModel: req.query.type
            });

            unlikeable.unlikes.push(newUnlike._id);
            unlikeable.save();

        }

        return res.json(200, {
            message: "Request successful!(Unlike)",
            data: {
                deletedUnlike: deletedUnlike
            }
        })
    }catch(err){
        console.log(err);
        return res.json(500, {
            message: 'Internal Server Error : unlike'
        });
    }
}

