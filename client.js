// Change 1: Point to your Vercel function (relative path)
const API_URL = "https://script.google.com/macros/s/AKfycbzJppw9S0jT9wDjbzjpS5d2AJcaNu4TAT4wrWmLSH68bLg6y20fihcn6zhri095scAj2Q/exec"; 

const msg = document.getElementById("msg");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirm = document.getElementById("confirm");
const identifier = document.getElementById("identifier");

function setMessage(text) {
  if (msg) {
    msg.innerText = text;
  }
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (error) {
    return { status: "error", message: "Invalid server response", detail: text };
  }
}

async function requestAuth(payload) {
  // Change 2: Use standard JSON headers for Vercel
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json" 
    },
    body: JSON.stringify(payload)
  });

  return safeJson(response);
}

async function getIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    const data = await res.json();
    return data.ip;
  } catch (error) {
    return "unknown";
  }
}

function validateSignup() {
  if (!username || !email || !password || !confirm) {
    return "Signup form is missing fields.";
  }

  if (!username.value.trim() || !email.value.trim() || !password.value.trim()) {
    return "Please fill out all required fields.";
  }

  if (password.value !== confirm.value) {
    return "Passwords do not match";
  }

  return "";
}

async function signup() {
  const error = validateSignup();
  if (error) {
    setMessage(error);
    return;
  }

  setMessage("Creating account...");

  const data = await requestAuth({
    action: "signup",
    username: username.value.trim(),
    email: email.value.trim(),
    password: password.value
  });

  setMessage(data.message || "Signup complete.");
}

async function login() {
  if (!identifier || !password) {
    setMessage("Login form is missing fields.");
    return;
  }

  if (!identifier.value.trim() || !password.value.trim()) {
    setMessage("Please enter your username/email and password.");
    return;
  }

  setMessage("Signing in...");
  const ip = await getIP();

  const data = await requestAuth({
    action: "login",
    identifier: identifier.value.trim(),
    password: password.value,
    ip
  });

  if (data.status === "success") {
    localStorage.setItem("token", data.token);
    localStorage.setItem("ip", ip);
    location.href = "index.html"; // dashboard.html
  } else {
    setMessage(data.message || "Unable to log in.");
  }
}

window.signup = signup;
window.login = login;
