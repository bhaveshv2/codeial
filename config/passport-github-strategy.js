const passport = require('passport');
const githubStrategy = require('passport-github').Strategy;
const crypto = require('crypto');

passport.use(new githubStrategy({
    clientID:'48c6448bb648b582882b',
    clientSecretL:'957c559a6596c8279758aeca96ee7495243bb1ac',
    callbackURL:'http://localhost:8000/users/auth/github/callback',   
},function(accessToken, refreshToken, profile,done){
    User.findOne({email:profile.emails[0].value}).exec(function(err,user){
        if(err){console.log('error in github strategy-passport',err);return;}

        console.log(accessToken,refreshToken);
        console.log(profile);

        if(user){
            return done(null,user);
        }else{
            User.create({
                name:profile.displayName,
                email:profile.emails[0].value,
                password:crypto.randomBytes(20).toString('hex'),
            },function(err,user){
                if(err){console.log('error in creating user github strategy-passport',err);return;}
                return done(null,user);
            })
        }
    });
}));

module.exports = passport;