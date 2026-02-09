const API_URL = "https://script.google.com/macros/s/AKfycbzJppw9S0jT9wDjbzjpS5d2AJcaNu4TAT4wrWmLSH68bLg6y20fihcn6zhri095scAj2Q/exec";

async function getIP() {
  const res = await fetch("https://api.ipify.org?format=json");
  const data = await res.json();
  return data.ip;
}

// AUTO CHECK LOGIN
(async () => {
  const token = localStorage.getItem("token");
  if (!token) location.href = "login.html";

  const ip = await getIP();

  fetch(API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    action: "validate",
    token: token,
    ip: ip
  })
})
  .then(r => r.json())
  .then(d => {
    if (d.status !== "success") {
      localStorage.clear();
      location.href = "login.html";
    }
  });
})();

function logout() {
  localStorage.clear();
  location.href = "login.html";
}
