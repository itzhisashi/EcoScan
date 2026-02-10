// JavaScript for Password Visibility Toggle
        // password
        const togglePassword = document.querySelector('#togglePassword');
        const password = document.querySelector('#password');

        togglePassword.addEventListener('click', function (e) {
            const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
            password.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
        
        // confirm
        const toggleConfirm = document.querySelector('#toggleConfirm');
        const confirm = document.querySelector('#confirm');

        toggleConfirm.addEventListener('click', function (e) {
            const type = confirm.getAttribute('type') === 'password' ? 'text' : 'password';
            confirm.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
        
