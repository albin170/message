const STORAGE_KEY = 'messaging-app-messages';

const messageList = document.getElementById('messageList');
const messageForm = document.getElementById('messageForm');
const nameInput = document.getElementById('nameInput');
const messageInput = document.getElementById('messageInput');

function readMessages() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function writeMessages(messages) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

function formatTime(isoTime) {
  return new Date(isoTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function createMessageNode(message) {
  const item = document.createElement('li');

  const meta = document.createElement('div');
  meta.className = 'message__meta';

  const author = document.createElement('span');
  author.className = 'message__author';
  author.textContent = message.name;

  const time = document.createElement('time');
  time.dateTime = message.timestamp;
  time.textContent = formatTime(message.timestamp);

  meta.append(author, time);

  const body = document.createElement('p');
  body.className = 'message__text';
  body.textContent = message.text;

  item.append(meta, body);
  return item;
}

function renderMessages(messages) {
  messageList.replaceChildren(...messages.map(createMessageNode));
  messageList.scrollTop = messageList.scrollHeight;
}

function initialize() {
  const messages = readMessages();
  renderMessages(messages);

  messageForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const text = messageInput.value.trim();
    if (!name || !text) {
      return;
    }

    const updatedMessages = [
      ...readMessages(),
      {
        id: crypto.randomUUID(),
        name,
        text,
        timestamp: new Date().toISOString()
      }
    ].slice(-100);

    writeMessages(updatedMessages);
    renderMessages(updatedMessages);

    messageInput.value = '';
    messageInput.focus();
  });
}

initialize();
