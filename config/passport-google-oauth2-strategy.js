const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');

const User = require('../models/user');

//tell passport to use a new strategy for google login
passport.use(new googleStrategy({
        clientID:'979682234690-gj4bm1vlf50ijenejvk1s672shk7tihq.apps.googleusercontent.com',   
        clientSecret:'Xsi9NNN0uAx0JVYGDStw79sX',
        callbackURL:'http://localhost:8000/users/auth/google/callback',
    },
    function(accessToken, refreshToken, profile,done){                                         //accessToken is used for repeatedily use user information again (which is publicly available) once the user sign-in Refresh Token is a special kind of token that can be used to obtain a renewed access token
        User.findOne({email:profile.emails[0].value}).exec(function(err,user){
            if(err){console.log('error in google strategy-passport',err);return;}

            console.log(accessToken,refreshToken);
            console.log(profile);
            if(user){
                //if found, set this user as req.user or signing in user
                return done(null,user);
            }else{
                //if not found, create the user and set it as req.user
                User.create({
                    name:profile.displayName,
                    email:profile.emails[0].value,
                    password:crypto.randomBytes(20).toString('hex'),
                },function(err,user){
                    if(err){console.log('error in creating user google strategy-passport',err);return;}

                    return done(null,user);
                });

            }
        })
    }
));

module.exports =passport;