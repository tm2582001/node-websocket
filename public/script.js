const ws = new WebSocket(`ws://${document.location.hostname}:8081`);

const TODO = `
1. Customizing own messages
2. Customizing the full UI of the chat
3. Choose a room & then storing the messages on backend in a room
4. Authenticated chat (registration/login)
5. More of system generated messages
6. Thinking about how you can make it scalable (choosing API Gateway + WebSocket + Redis/ElastiCache for manging all the temp state + using dynamodb or mongoDb mysql, for managing full permanent state)
`

const username =
  localStorage.getItem("username") ||
  prompt("What  do you want your username to be?") ||
  'anonymous';

localStorage.setItem('username', username);

// ws.onopen = ()=>{

// }

ws.addEventListener("open", connectionOpen);
ws.addEventListener("message", handleSocketMessage);

function connectionOpen() {
  console.log("Websocket connection established");
}

function appendToChatbox({ sender, message }) {
  const div = document.createElement("div");
  div.className = "message-row";

  //dirty way of doing is inner html and sturdy way is creating a node over and over
  // if you do this sanitize the data before because it can lead to cross site scripting
  // div.innerHTML = `
  // <div class="sender">${sender}</div>
  // <div class="message">${message}</div>
  // `

  // better way
  const senderDiv = document.createElement("div");
  senderDiv.className = "sender";
  senderDiv.textContent = sender;

  const messageDiv = document.createElement("div");
  messageDiv.className = "message";
  messageDiv.textContent = message;

  div.appendChild(senderDiv);
  div.appendChild(messageDiv);
  document.getElementById("chat").appendChild(div);
}

function handleSocketMessage(e) {
  try {
    const realMessage = JSON.parse(e.data);
    const { sender, message } = realMessage;
    appendToChatbox({ sender, message });
  } catch (e) {
    // not for us
  }
}

const runHandler = (e) => {
  e.preventDefault();

  if (ws.readyState === WebSocket.OPEN) {
    const field = document.getElementById("message-field");
    const message = field.value;
    field.value = "";
    console.log(`Trying to send this message on socket: ${message}`);
    ws.send(JSON.stringify({
      sender: username,
      message
    }));
  } else {
    console.log("Still establishing connection");
  }
};
