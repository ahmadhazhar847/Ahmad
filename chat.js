const messagesEl = document.getElementById("messages");
const welcome = document.getElementById("welcome");
const form = document.getElementById("form");
const input = document.getElementById("input");
const send = document.getElementById("send");

const history = [];

function addMessage(role, text) {
  if (welcome) welcome.remove();
  const box = document.createElement("div");
  box.className = `msg ${role}`;
  const label = document.createElement("div");
  label.className = "label";
  label.textContent = role === "user" ? "YOU" : "JARVIS";
  const body = document.createElement("div");
  body.textContent = text;
  box.append(label, body);
  messagesEl.appendChild(box);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return body;
}

async function sendMessage(text) {
  addMessage("user", text);
  history.push({ role: "user", content: text });

  send.disabled = true;
  input.disabled = true;
  const answerEl = addMessage("assistant", "Thinking...");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history })
    });

    if (!res.ok) {
      throw new Error(await res.text() || `HTTP ${res.status}`);
    }

    const data = await res.json();
    const answer = data.response || data.content || data.result || "No response.";
    answerEl.textContent = answer;
    history.push({ role: "assistant", content: answer });
  } catch (err) {
    answerEl.textContent = "Error: " + err.message;
  } finally {
    send.disabled = false;
    input.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text || send.disabled) return;
  input.value = "";
  sendMessage(text);
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    form.requestSubmit();
  }
});
