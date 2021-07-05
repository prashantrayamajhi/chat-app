const socket = io();

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".body");
const onlineTag = document.getElementById("online");

// get username room from url
const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

if (!username.trim() || username.trim().length <= 0 || !username) {
  window.location.href = "/";
}
socket.emit("online");

socket.emit("join", username, (error) => {
  socket.emit("online");
  if (error) {
    alert(error);
    location.href = "/";
  }
});

socket.on("online", (online) => {
  onlineTag.innerText = "Users online : " + online;
});

socket.on("message", ({ username, text, time }) => {
  outputMessage(username, text, time);
  // scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let message = e.target.elements.msg.value;
  message = message.trim();
  socket.emit("message", message);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// output message to dom
const outputMessage = (name, text, time) => {
  const div = document.createElement("div");
  div.classList.add("message-wrapper");
  div.innerHTML = `
  <div class="detail ${username === name && "user"}">
  <span class="username">${name} -</span>
  <span class="time">${time}</span>
  </div>
    <p class="message ${username === name && "userMessage"}">${text}</p>
    `;
  document.querySelector(".body").appendChild(div);
};
