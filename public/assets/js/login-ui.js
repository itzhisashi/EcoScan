const togglePassword = document.querySelector('#togglePassword');
const password = document.querySelector('#password');

if (togglePassword) {
  togglePassword.onclick = () => {
    password.type = password.type === "password" ? "text" : "password";
    togglePassword.classList.toggle("fa-eye-slash");
  };
}

const toggleConfirm = document.querySelector('#toggleConfirm');
const confirm = document.querySelector('#confirm');

if (toggleConfirm) {
  toggleConfirm.onclick = () => {
    confirm.type = confirm.type === "password" ? "text" : "password";
    toggleConfirm.classList.toggle("fa-eye-slash");
  };
}
