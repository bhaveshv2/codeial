const User = require('../models/user');
const fs= require('fs');
const path = require('path');


module.exports.profile = function(req, res){
    User.findById(req.params.id,function(err,user){
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user:user
        });
    });
}


module.exports.update = async function(req,res){
    if(req.user.id==req.params.id){
        try{
            let user = await User.findById(req.params.id);
            
            User.uploadedAvatar(req,res,function(err){
                if(err){
                    console.log('***Multer Error***',err);
                }

                user.name =  req.body.name;
                user.email = req.body.email;
                if(req.file){
                    //before this if, there are multiple files are storing in the uploads but now after if it get replaced with new one
                    // if(fs.existsSync(path.join(__dirname,'..',user.avatar))){
                    //     fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                    // }
                    //this is saving a path of a uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
            
        }catch(err){
            console.log('error:',err);
            return res.direct('back');
        }
    }
    else{
        req.flash('error','Unauthorized!');
        return res.status(401).send('Unauthorized')
    }

}

module.exports.sendRequest = async function (req, res) {
    if (req.user.id === req.params.id) {
        try {
            let senderUser = await User.findById(req.params.id);
            let receiverUser = await User.findById(req.params.receiverId);

            if (senderUser.friends.includes(receiverUser._id)) {
                console.log('Already Friends');
                throw error;
            }

            senderUser.sentRequests.unshift(receiverUser._id);
            receiverUser.receivedRequests.unshift(senderUser._id);

            await senderUser.save();
            await receiverUser.save();

            req.flash('success', 'Request Sent!');
            return res.redirect('back');
        } catch (err) {
            console.log('error:', err);
            return res.direct('back');
        }
    } else {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

module.exports.acceptRequest = async function (req, res) {
    if (req.user.id === req.params.id) {
        try {
            let senderUser = await User.findById(req.params.senderId);
            let receiverUser = await User.findById(req.params.id);

            if (receiverUser.receivedRequests.map(request => request.toString()).includes(senderUser._id.toString()) && senderUser.sentRequests.map(request => request.toString()).includes(receiverUser._id.toString())) {
                receiverUser.friends.push(senderUser);
                senderUser.friends.push(receiverUser);
                receiverUser.receivedRequests.splice(receiverUser.receivedRequests.indexOf(senderUser._id), 1);
                senderUser.sentRequests.splice(senderUser.sentRequests.indexOf(receiverUser._id), 1);

                await receiverUser.save();
                await senderUser.save();

                req.flash('success', 'Request Accepted!');
                return res.redirect('back');
            } else {
                console.log('Freind Request Does Not Exist');
                throw error;
            }
        } catch (err) {
            req.flash('error',err);

            return res.redirect('back');
        }
    } else {
        req.flash('error', 'Unauthorized!');
        return res.status(401).send('Unauthorized');
    }
}

// render the sign up page
module.exports.signUp = function(req, res){
    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_up', {
        title: "SocioX | Sign Up"
    });
}


// render the sign in page
module.exports.signIn = function(req, res){

    if (req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_sign_in', {
        title: "SocioX | Sign In"
    })
}

// get the sign up data
module.exports.create = function(req, res){
    if (req.body.password != req.body.confirm_password){
        return res.redirect('back');
    }

    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return;}

        if (!user){
            User.create(req.body, function(err, user){
                if(err){console.log('error in creating user while signing up'); return;}

                return res.redirect('/users/sign-in');
            });
        }else{
            return res.redirect('back');
        }
    });
}


// sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success','Logged in successfully');
    return res.redirect('/');
}

module.exports.destroySession = function(req, res){
    req.logout();
    req.flash('success','You havve Logged out');

    return res.redirect('/');
}

module.exports.fetchFriends = async function(req,res){
    let friends = await User.findById(req.params.id);
    
    try{
            friends = await friends.populate('friends').execPopulate();
            


            return res.render('friend_lists',{
                title:'Friends list',
                friends:friends,
            });
                
        
            // req.flash('success', 'Friends Published!');

            // return res.redirect('back');
    }catch(err){
        req.flash('error',err);
        return res.redirect('back');
    }
}