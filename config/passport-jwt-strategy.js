const passport = require('passport');
const JWTStrategy = require('passport-jwt').Strategy;                   
const ExtarctJWT = require('passport-jwt').ExtractJwt;                  //help in extract JWT from the header
const User = require('../models/user');

let opts = {
    jwtFromRequest:ExtarctJWT.fromAuthHeaderAsBearerToken(),  //method creates a new extractor that looks for the JWT in the authorization header with the scheme 'bearer'.
    secretOrKey : "codeial"                                 //using this key we're decrypting the header as it is used to encrypt it in users_api (line 21)
}

//This is used for Authenticate the user
// User is present already in JWT, we're just fetching out the id from the payload and checking if user there or not(for every session)
passport.use(new JWTStrategy(opts,function(jwtPayload,done){
    User.findById(jwtPayload._id,function(err,user){
        if(err){
            console.log('Error in finding user from JWT',err);
            return;
        }

        if(user){
            return done(null,user);
        }else{
            return done(null,false);
        }
    });
}));


module.exports = passport;