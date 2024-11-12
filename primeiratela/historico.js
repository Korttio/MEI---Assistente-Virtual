// Função para carregar as mensagens do localStorage e exibi-las
const loadHistoryMessages = () => {
    const historicoContainer = document.getElementById('historico-mensagens');
    const savedChats = localStorage.getItem("saved-chats");

    if (savedChats) {
        historicoContainer.innerHTML = savedChats; // Carrega as mensagens salvas
    } else {
        historicoContainer.innerHTML = '<p>Nenhuma mensagem encontrada.</p>';
    }
};

// Chama a função ao carregar a página
document.addEventListener('DOMContentLoaded', loadHistoryMessages);
