const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require('../mailer/comment_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');



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

                comment = await comment.populate('user','name email').execPopulate();

                // commentsMailer.newComment(comment);
                let job = queue.create('emails',comment).save(function(err){
                    if(err){
                        console.log('Error in creating a queue');
                        return;
                    }

                    console.log('job enqueued',job.id);
                });
                if(req.xhr){

                    return res.status(200).json({
                        data:{
                            comment:comment
                        },
                        message:"Comment created!"
                    })
                }

                req.flash('success','You commented on the post!');

                res.redirect('/');
        }
    }catch(err){
        req.flash('error',err);
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

            //delete the associated likes for this comment
            await Like.deleteMany({likeable:comment._id, onModel:'Comment'});

            if(req.xhr){
                return res.status(200).json({
                    data:{
                        comment_id:req.params.id,
                    },
                    message:"Comment Deleted!"
                });
            }
            req.flash('success','You had deleted the comment!');

            return res.redirect('back');
        }
        else{
            return res.redirect('back');
        }
    }catch(err){
        req.flash('error',err);
        return; 
    }
    
}