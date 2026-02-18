/* CONFIG */
const API_URL =
  "https://script.google.com/macros/s/AKfycbwagXkfnb2xKxOkfU00tRcwD4IvV6Wgx9p6ACqP_KgTStu75z59yH3I8450LiB8QoMp/exec";

/* HELPERS */
function el(id) {
  return document.getElementById(id);
}

/* message types: error | success | info */
function setMessage(text, type = "error") {
  const msg = el("msg");
  if (!msg) return;

  msg.textContent = text;
  msg.style.display = "block";
  msg.style.padding = "10px 14px";
  msg.style.borderRadius = "8px";
  msg.style.fontSize = "14px";

  // reset
  msg.style.color = "";
  msg.style.background = "";

  if (type === "success") {
    msg.style.color = "#2e7d32";
    msg.style.background = "rgba(46, 125, 50, 0.12)";
  } else if (type === "info") {
    msg.style.color = "#1b5e20";
    msg.style.background = "rgba(76, 175, 80, 0.18)";
  } else {
    // error
    msg.style.color = "#c62828";
    msg.style.background = "rgba(198, 40, 40, 0.12)";
  }
}

function hideMessage() {
  const msg = el("msg");
  if (msg) msg.style.display = "none";
}

async function safeJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return {
      status: "error",
      message: "Invalid server response",
      raw: text
    };
  }
}

async function requestAuth(payload) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify(payload)
  });

  return safeJson(res);
}

async function getIP() {
  try {
    const res = await fetch("https://api.ipify.org?format=json");
    return (await res.json()).ip;
  } catch {
    return "unknown";
  }
}

/* SIGNUP */
function validateSignup() {
  const username = el("username");
  const email = el("email");
  const password = el("password");
  const confirm = el("confirm");

  if (!username || !email || !password || !confirm) {
    return "Signup form fields missing.";
  }

  if (
    !username.value.trim() ||
    !email.value.trim() ||
    !password.value.trim()
  ) {
    return "Please fill all required fields.";
  }

  if (password.value !== confirm.value) {
    return "Passwords do not match.";
  }

  return "";
}

async function signup() {
  hideMessage();

  const error = validateSignup();
  if (error) {
    setMessage(error, "error");
    return;
  }

  const username = el("username");
  const email = el("email");
  const password = el("password");

  // ✅ GREEN INFO MESSAGE
  setMessage("Creating account...", "info");

  const data = await requestAuth({
    action: "signup",
    username: username.value.trim(),
    email: email.value.trim(),
    password: password.value
  });

  if (data.status === "success") {
    // ✅ GREEN SUCCESS MESSAGE
    setMessage("Signup successful. You can log in now.", "success");
  } else {
    setMessage(data.message || "Signup failed.", "error");
  }
}

/* LOGIN */
async function login() {
  hideMessage();

  const identifier = el("identifier");
  const password = el("password");

  if (!identifier || !password) {
    setMessage("Login form fields missing.", "error");
    return;
  }

  if (!identifier.value.trim() || !password.value.trim()) {
    setMessage("Enter username/email and password.", "error");
    return;
  }

  setMessage("Signing in...", "info");

  const ip = await getIP();

  const data = await requestAuth({
    action: "login",
    identifier: identifier.value.trim(),
    password: password.value,
    ip
  });

  if (data.status === "success") {
    localStorage.setItem("token", data.token || "");
    localStorage.setItem("ip", ip);
    location.href = "home.html";
  } else {
    setMessage(data.message || "Invalid login credentials.", "error");
  }
}

/* =========================
   EXPOSE FUNCTIONS
========================= */
window.signup = signup;
window.login = login;

/* ================= Forgot Message =============== */

// Modal Controls
function openForgotModal() {
    document.getElementById('forgotModal').style.display = 'flex';
    document.getElementById('resetMsg').innerText = ''; // clear previous messages
    document.getElementById('resetEmail').value = ''; 
}

function closeForgotModal() {
    document.getElementById('forgotModal').style.display = 'none';
}

// Close modal if user clicks outside of it
window.onclick = function(event) {
    const modal = document.getElementById('forgotModal');
    if (event.target == modal) closeForgotModal();
}

// Submit Forgot Password
async function submitForgotPassword() {
    const email = document.getElementById('resetEmail').value.trim();
    const btn = document.getElementById('resetBtn');
    const msg = document.getElementById('resetMsg');

    if (!email) {
        msg.style.color = "red";
        msg.innerText = "Please enter your email.";
        return;
    }

    // UI Loading State
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    msg.innerText = "";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: JSON.stringify({
                action: "forgot_password",
                email: email
            })
        });

        const data = await response.json();

        if (data.status === "success") {
            msg.style.color = "#16a34a"; // Green success
            msg.innerText = data.message;
            // Optionally close modal after 3 seconds
            setTimeout(closeForgotModal, 3000);
        } else {
            msg.style.color = "red";
            msg.innerText = data.message;
        }
    } catch (error) {
        msg.style.color = "red";
        msg.innerText = "Connection failed. Please try again.";
        console.error(error);
    } finally {
        // Restore button state
        btn.innerHTML = '<i class="fa-solid fa-envelope"></i> Send Temporary Password';
        btn.disabled = false;
    }
}
