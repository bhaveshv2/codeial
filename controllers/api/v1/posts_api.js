const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index = async function(req,res){

    let posts = await Post.find({})
        .sort('-createdAt')                        
        .populate('user')
        .populate({                                                              
            path:'comments',
            options: { sort: "-createdAt" }, 
            populate:{
                path:'user'
            }
        });

    return res.status(200).json({
        message: "List of Posts",
        posts:posts
    });
}

module.exports.destroy = async function(req,res){
    try{
        let post = await Post.findById(req.params.id);
        
        //.id means converting the object id into string
        if(post.user == req.user.id){
            post.remove();

            await Comment.deleteMany({post:req.params.id});

            return res.status(200).json({
                message: "Post and Associated comments deleted successfully"
            });
        
        }else{
            // req.flash('error', 'You cannot delete this post!');

            return res.status(401).json({
                message:"You cannot delete this post!",
            });
        }
    }catch(err){
        console.log('*****',err);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
    
}