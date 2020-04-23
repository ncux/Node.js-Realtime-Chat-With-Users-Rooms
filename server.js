const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const PORT = process.env.PORT || 5000;

const formatMessage = require('./utils/messages');
const { joinUserToRoom, getCurrentUser, getUsersInRoom, removeUser } = require('./utils/users');

const chatBot = 'Chat Bot';

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

// on client connect
io.on('connection', socket => {
    console.log(`client connected`);

    // when user joins a room
    socket.on('join_room', ({ username, room }) => {

        const user = joinUserToRoom(socket.id, username, room);
        socket.join(user.room);

        // welcomes the current user
        socket.emit('message', formatMessage(chatBot, 'Welcome to Chat App'));
        // broadcast when a user connects
        socket.broadcast.to(user.room).emit('message', formatMessage(chatBot, `${username} has joined the chat`));

        // broadcast users and room info
        io.to(user.room).emit('room_users', { room: user.room, users: getUsersInRoom(user.room) });
    });

    // listen for client message
    socket.on('chat_message', message => {
        const { username, room } = getCurrentUser(socket.id);
        if(!username || !room) return;
        io.to(room).emit('message', formatMessage(username, message));  // "broadcast" client message
    });

    // runs when client disconnects | broadcast
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if(user) {
            io.to(user.room).emit('message', formatMessage(chatBot, `${user.username} has left the chat`));
            // broadcast users and room info
            io.to(user.room).emit('room_users', { room: user.room, users: getUsersInRoom(user.room) });
        }
    });
});


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
