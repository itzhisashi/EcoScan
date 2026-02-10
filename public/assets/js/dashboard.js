const API_URL = "/api/auth";

async function getIP() {
  try {
    const r = await fetch("https://api.ipify.org?format=json");
    return (await r.json()).ip;
  } catch {
    return "unknown";
  }
}

(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    location.href = "login.html";
    return;
  }

  const ip = await getIP();

  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "validate",
      token,
      ip,
    }),
  });

  const data = await res.json();

  if (data.status !== "success") {
    localStorage.clear();
    location.href = "login.html";
  }
})();

function logout() {
  localStorage.clear();
  location.href = "login.html";
}
