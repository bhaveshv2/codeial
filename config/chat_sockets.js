//it is a observer which is going to receive incoming connections from the subscribers 
module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);
    const Chat = require('../models/chat');
    const mongoose = require('../config/mongoose');
    mongoose.Promise = require('bluebird');

    io.sockets.on('connection',function(socket){
        console.log('New connection received to the server',socket.id);

        socket.on('disconnect',function(){
            console.log('socket disconnected!');
        });

        socket.on('join_room',function(data){
            console.log('joining request rec.',data);

            socket.join(data.chatroom);

            io.in(data.chatroom).emit('user_joined',data);
        });

        socket.on('send_message', function(data){
            console.log(data);
            io.in(data.chatroom).emit('receive_message', data);

            mongoose.then(data => {
                console.log('Connected correctly to the server');
    
                let chatMessage = new Chat({message:data.message});
                console.log(chatMessage);
                chatMessage.save();
            });
        });
    });
}