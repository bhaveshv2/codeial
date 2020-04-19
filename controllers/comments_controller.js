const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = function(req,res){
    //find the post whether exist or not as some suspect can alter the website and then create the comment after that along with the insert the ids of the comment to the post 
    Post.findById(req.body.post,function(err,post){
        if(post){
            Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id,
            },function(err,comment){
                if(err){
                    console.log('Error in creating the comment');
                    return;
                }
                //adding comment to post in comment id array after creating the comment
                post.comments.push(comment);
                //whenever we updating something in the db then we have to call save() after that to block it. 
                post.save();

                res.redirect('/');
            });
        }
    });
}

module.exports.destroy = function(req,res){
    Comment.findById(req.params.id,function(err,comment){
        if(comment.user == req.user.id){
            let postId = comment.post;
            comment.remove();

            Post.findByIdAndUpdate(postId,{$pull:{comments:req.params.id}},function(err,post){
                return res.redirect('back');
            });
        }
        else{
            return res.redirect('back');
        }
    });
}