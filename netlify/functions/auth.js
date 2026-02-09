const API_URL = "PASTE_YOUR_GOOGLE_SCRIPT_URL";

// GET IP
async function getIP() {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
}

// SIGNUP
function signup() {
  if (password.value !== confirm.value) {
    msg.innerText = "Passwords do not match";
    return;
  }

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "signup",
      username: username.value,
      email: email.value,
      password: password.value
    })
  })
  .then(r => r.json())
  .then(d => msg.innerText = d.message);
}

// LOGIN
async function login() {
  const ip = await getIP();

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "login",
      identifier: identifier.value,
      password: password.value,
      ip: ip
    })
  })
  .then(r => r.json())
  .then(d => {
    if (d.status === "success") {
      localStorage.setItem("token", d.token);
      localStorage.setItem("ip", ip);
      location.href = "dashboard.html";
    } else {
      msg.innerText = d.message;
    }
  });
}
