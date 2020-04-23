const chartForm = document.querySelector('#chat-form');
const roomName = document.querySelector('#room-name');
const usersList = document.querySelector('#users');
const messageInput = document.querySelector('#message');
const chatMessagesContainer = document.querySelector('.chat-messages');
// get username and room from url query strings
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const socket = io();

// join chat room
socket.emit('join_room', { username, room });

// get room name and users in the room
socket.on('room_users', ({ room, users }) => {
  showRoomName(room);
  showRoomUsers(users);
});

// handle message from the server
socket.on('message', message => {
  console.log(`@ the client: ${message.message}`);
  showChatMessage(message);

  // scroll down to show new chat message
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
});

// send message to the server
const sendMessage = e => {
  e.preventDefault();

  const message = messageInput.value;
  console.log(message);
  // send message to the server
  socket.emit('chat_message', message);

  // clear the chat input
  messageInput.value = '';
  messageInput.focus();
};

// client sending a message
chartForm.addEventListener('submit', sendMessage);

// show message on client
const showChatMessage = msg => {
  const { username, message, timestamp } = msg;
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta"> ${username}
        <span>${timestamp}</span>    
    </p>
    <p>${message}</p>
  `;
  chatMessagesContainer.append(div);
};

const showRoomName = room => roomName.textContent = room;

const showRoomUsers = users => usersList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`;


