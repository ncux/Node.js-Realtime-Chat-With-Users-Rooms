const chartForm = document.querySelector('#chat-form');
const messageInput = document.querySelector('#message');
const chatMessagesContainer = document.querySelector('.chat-messages');

const socket = io();

socket.on('message', message => {
  console.log(`@ the client: ${message}`);
  showChatMessage(message);

  // scroll down to show new chat message
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
});

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
const showChatMessage = message => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">
        <span></span>    
    </p>
    <p>${message}</p>
  `;
  chatMessagesContainer.append(div);
};


