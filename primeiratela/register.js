document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    // Verifica se o email já está registrado
    if (localStorage.getItem(email)) {
        errorMessage.textContent = "Este email já está registrado.";
        errorMessage.style.display = "block";
    } else {
        // Cria um objeto com os dados do usuário
        const userData = {
            name: name,
            email: email,
            password: password
        };

        // Armazena os dados do usuário no Local Storage
        localStorage.setItem(email, JSON.stringify(userData));

        alert("Registro bem-sucedido! Você será redirecionado para a página de login.");
        window.location.href = "login.html"; // Redireciona para a página de login
    }
});


document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    // Obtendo os valores inseridos pelo usuário
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorMessage = document.getElementById("errorMessage");

    // Verifica se o email está registrado no localStorage
    const userData = JSON.parse(localStorage.getItem(email));

    // Verifica se o email existe e se a senha está correta
    if (userData && userData.password === password) {
        alert("Login bem-sucedido!");
        // Redireciona para a página principal
        window.location.href = "menu.html";
    } else {
        // Exibe uma mensagem de erro caso as credenciais estejam incorretas
        errorMessage.textContent = "Email ou senha incorretos.";
        errorMessage.style.display = "block";
    }
});
