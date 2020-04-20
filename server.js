const express = require('express');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');
const PORT = process.env.PORT || 5000;

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

app.use(express.static(path.join(__dirname, 'public')));

// on client connect
io.on('connection', socket => {
    console.log(`client connected`);

    // welcomes the current user
    socket.emit('message', 'Welcome to Chat App');

    // broadcast when a user connects
    socket.broadcast.emit('message', '...has joined the chat');

    // listen for client message
    socket.on('chat_message', message => {
        console.log(`@ the server: ${message}`);
        io.emit('message', message);  // "broadcast" client message
    });

    // runs when client disconnects | broadcast
    socket.on('disconnect', () => io.emit('message', '...has left the chat'));
});


server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
