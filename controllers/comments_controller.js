const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req,res){
    //find the post whether exist or not as some suspect can alter the website and then create the comment after that along with the insert the ids of the comment to the post 
    try{
        let post =await Post.findById(req.body.post);
        if(post){
            let comment = await Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id,
            });
                    
                //adding comment to post in comment id array after creating the comment
                post.comments.push(comment);
                //whenever we updating something in the db then we have to call save() after that to block it. 
                post.save();

                res.redirect('/');
        }
    }catch(err){
        console.log('Error',err);
        return;
    }
}

module.exports.destroy = async function(req,res){
    try{
        let comment = await Comment.findById(req.params.id);
        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();

            let post = await Post.findByIdAndUpdate(postId , {$pull:{comments:req.params.id}});
            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }
    }catch(err){
        console.log('Error',err);
        return; 
    }
    
}