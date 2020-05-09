//it is a observer which is going to receive incoming connections from the subscribers 
module.exports.chatSockets = function(socketServer){
    let io = require('socket.io')(socketServer);
    const Chat = require('../models/chat');
    const mongoose = require('../config/mongoose');

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

            let chatMessage = new Chat({message:data.message,sender:data.user_email});
            console.log(chatMessage);
            chatMessage.save(err=>{
                if(err){
                    console.log('error is in chat message:',err);
                }
            });


        });
    });
}