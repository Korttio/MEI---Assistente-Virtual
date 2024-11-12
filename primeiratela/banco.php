<?php
// Conectar ao banco de dados
$servername = "login.html";
$username = "root";
$password = "Jj10652482"; // Coloque a senha do seu banco de dados
$dbname = "sistema_login";

$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexão
if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error);
}

// Função para criar um novo usuário
function criarUsuario($username, $password, $email) {
    global $conn;

    // Criptografar a senha
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO usuarios (username, password, email) VALUES (?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $username, $hashedPassword, $email);

    if ($stmt->execute()) {
        echo "Usuário criado com sucesso!";
    } else {
        echo "Erro: " . $stmt->error;
    }

    $stmt->close();
}

// Exemplo de uso
criarUsuario("usuario_exemplo", "senha123", "email@exemplo.com");

$conn->close();
?>