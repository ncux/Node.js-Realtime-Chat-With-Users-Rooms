let users = [];

// join user to the chat room
const joinUserToRoom = (id, username, room) => {
    const user = { id, username, room };
    users.push(user);
    return user;
};

// get the current user in chat
const getCurrentUser = id => users.find(user => user.id === id);

// get users in room
const getUsersInRoom = room => users.filter(user => user.room === room);

// user leaves chat room
const removeUser = id => {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

module.exports = { joinUserToRoom, getCurrentUser, getUsersInRoom, removeUser };
