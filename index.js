const express = require('express');
const env = require('./config/environment');
const cookieParser = require('cookie-parser');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const session = require('express-session');               // used for session cookie             
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJwt = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const passportGithub = require('./config/passport-github-strategy');
const MongoStore = require('connect-mongo')(session);
const sassMiddleware =require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');

//Setup the chat server to be used with socket.io
const chatServer = require('http').Server('app');
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('Chat server is listening on port 5000');

const path = require('path');
app.use(sassMiddleware({
    src: path.join(__dirname, env.asset_path,'scss'),
    dest: path.join(__dirname,env.asset_path,'css'),
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static(env.asset_path));

//make the uploads path available to the browser
app.use('/uploads', express.static(__dirname + '/uploads'));             //the first '/uploads' is route and the 2nd one is used to join the folder with current directory where the root or this file is existed.

app.use(expressLayouts);
// extract style and scripts from sub pages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db
app.use(session({
    name: 'sociox',
    // TODO change the secret before deployment in production mode
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: new MongoStore(
        {
            mongooseConnection: db,
            autoRemove: 'disabled'
        },
        function(err){
            console.log(err ||  'connect-mongodb setup ok');
        }
    )
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

//use flash after the session
app.use(flash());
app.use(customMware.setflash);

// use express router
app.use('/', require('./routes'));


app.listen(port, function(err){
    if (err){
        console.log(`Error in running the server: ${err}`);
    }

    console.log(`Server is running on port: ${port}`);
});
