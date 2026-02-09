const API_URL = "/api/auth";

const msg = document.getElementById("msg");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirm = document.getElementById("confirm");
const identifier = document.getElementById("identifier");

function setMessage(text) {
  if (msg) msg.innerText = text;
}

async function requestAuth(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

async function getIP() {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    return (await r.json()).ip;
  } catch {
    return "unknown";
  }
}

/* SIGNUP */
async function signup() {
  if (!username.value || !email.value || !password.value || !confirm.value) {
    setMessage("All fields required");
    return;
  }

  if (password.value !== confirm.value) {
    setMessage("Passwords do not match");
    return;
  }

  setMessage("Creating account...");

  const data = await requestAuth({
    action: "signup",
    username: username.value.trim(),
    email: email.value.trim(),
    password: password.value,
  });

  setMessage(data.message);
}

/* LOGIN */
async function login() {
  if (!identifier.value || !password.value) {
    setMessage("Missing credentials");
    return;
  }

  setMessage("Signing in...");
  const ip = await getIP();

  const data = await requestAuth({
    action: "login",
    identifier: identifier.value.trim(),
    password: password.value,
    ip,
  });

  if (data.status === "success") {
    localStorage.setItem("token", data.token);
    localStorage.setItem("ip", ip);
    location.href = "index.html";
  } else {
    setMessage(data.message);
  }
}

window.signup = signup;
window.login = login;
