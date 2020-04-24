const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { joinUserToRoom, getCurrentUser, getUsersInRoom, removeUser } = require('./utils/users');

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const chatBot = 'Chat bot';

// Run when client connects
io.on('connection', socket => {
    socket.on('join_room', ({ username, room }) => {
        const user = joinUserToRoom(socket.id, username, room);

        socket.join(user.room);

        // Welcome current user
        socket.emit('message', formatMessage(chatBot, 'Welcome to Chat App!'));

        // Broadcast when a user connects
        socket.broadcast.to(user.room)
            .emit('message', formatMessage(chatBot, `${user.username} has joined the chat`));

        // Send users and room info
        io.to(user.room).emit('room_users', { room: user.room, users: getUsersInRoom(user.room) });
    });

    // Listen for chatMessage
    socket.on('chat_message', msg => {
        const { username, room } = getCurrentUser(socket.id);
        io.to(room).emit('message', formatMessage(username, msg));
    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit(
                'message',
                formatMessage(chatBot, `${user.username} has left the chat`)
            );

            // Send users and room info
            io.to(user.room).emit('room_users', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
