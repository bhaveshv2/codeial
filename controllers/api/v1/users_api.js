const User = require('../../../models/user');
const jwt = require('jsonwebtoken');

module.exports.createSession = async function(req, res){
    // req.flash('success','Logged in successfully');
    // return res.redirect('/');

    //Whenever username and password received, we need to find that user and generate the jwt
    try{
        let user = await User.findOne({email:req.body.email});

        if(!user || user.password!=req.body.password){
            return req.status(422).json({
                message:"Invalid username or password"
            });
        }

        return res.status(200).json({
            message:"Sign in successful,here is the token,please keeep it safe!",
            data:{
                token:jwt.sign(user.toJSON(),'codeial',{expiresIn:100000}),          //will set the token and send it to the user.
            }
        });
    }catch(err){
        console.log('*****',err);
        return res.status(500).json({
            message:"Internal Server Error"
        });
    }
}
