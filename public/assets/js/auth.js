import { supabase } from "./supabase.js";

const msg = document.getElementById("msg");

function setMessage(text, ok = false) {
  if (!msg) return;
  msg.innerText = text;
  msg.style.color = ok ? "green" : "red";
}

/* ---------- SIGNUP ---------- */
window.signup = async function () {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;

  if (!username || !email || !password) {
    setMessage("Fill all fields");
    return;
  }

  if (password !== confirm) {
    setMessage("Passwords do not match");
    return;
  }

  setMessage("Creating account...", true);

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    setMessage(error.message);
    return;
  }

  await supabase.from("profiles").insert({
    id: data.user.id,
    username
  });

  setMessage("Account created! You can login now.", true);
};

/* ---------- LOGIN ---------- */
window.login = async function () {
  const identifier = document.getElementById("identifier").value.trim();
  const password = document.getElementById("password").value;

  if (!identifier || !password) {
    setMessage("Missing login details");
    return;
  }

  setMessage("Signing in...", true);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: identifier,
    password
  });

  if (error) {
    setMessage(error.message);
    return;
  }

  location.href = "index.html";
};

/* ---------- LOGOUT ---------- */
window.logout = async function () {
  await supabase.auth.signOut();
  location.href = "login.html";
};
