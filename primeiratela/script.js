// Seleciona elementos da página
const typingForm = document.querySelector(".typing-form"); // Formulário de envio de mensagens
const chatContainer = document.querySelector(".chat-list"); // Contêiner onde as mensagens do chat serão exibidas
const suggestions = document.querySelectorAll(".suggestion"); // Sugestões de mensagens pré-definidas (opcional)
const toggleThemeButton = document.querySelector("#theme-toggle-button"); // Botão de alternância de tema
const deleteChatButton = document.querySelector("#delete-chat-button"); // Botão para apagar o histórico do chat
const voicechatButton = document.querySelector("#voice-chat-button"); // Botão para ativar o chat por voz
const resultado = document.querySelector("#resultado"); // Área para exibir o resultado de alguma ação (opcional)

// Variáveis de controle
let userMessage = null; // Armazena a mensagem do usuário
let isResponseGenerating = false; // Flag para verificar se uma resposta está sendo gerada

// URL e chave da API para comunicação com a API de linguagem generativa
const API_KEY = "AIzaSyC9Yfq5AgZfi4a6BbBw23fwyia9laSOzXc";
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

// Função para carregar dados do histórico de chat e tema do localStorage
const loadDataFromLocalstorage = () => {
  const savedChats = localStorage.getItem("saved-chats"); // Carrega o histórico salvo
  const isLightMode = (localStorage.getItem("themeColor") === "light_mode");

  // Define o tema e o conteúdo do botão de alternância de tema
  document.body.classList.toggle("light_mode", isLightMode);
  toggleThemeButton.innerText = isLightMode ? "dark_mode" : "light_mode";

  // Adiciona o histórico de mensagens ao contêiner de chat
  chatContainer.innerHTML = savedChats || '';
  document.body.classList.toggle("hide-header", savedChats);

  // Rola para o final da lista de mensagens
  chatContainer.scrollTo(0, chatContainer.scrollHeight); 
}

// Função para criar elementos de mensagem
const createMessageElement = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes); // Adiciona classes personalizadas ao elemento
  div.innerHTML = content;
  return div;
}

// Função para mostrar efeito de digitação
const showTypingEffect = (text, textElement, incomingMessageDiv) => {
  const words = text.split(' ');
  let currentWordIndex = 0;

  const typingInterval = setInterval(() => {
    // Adiciona palavra por palavra ao elemento de texto
    textElement.innerText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex++];
    incomingMessageDiv.querySelector(".icon").classList.add("hide");

    // Interrompe o efeito quando o texto completo é exibido
    if (currentWordIndex === words.length) {
      clearInterval(typingInterval);
      isResponseGenerating = false;
      incomingMessageDiv.querySelector(".icon").classList.remove("hide");
      localStorage.setItem("saved-chats", chatContainer.innerHTML); // Salva o histórico no localStorage
    }
    chatContainer.scrollTo(0, chatContainer.scrollHeight); 
  }, 75);
}

// Função para gerar resposta da API
const generateAPIResponse = async (incomingMessageDiv) => {
  const textElement = incomingMessageDiv.querySelector(".text"); 
  try {
    // Faz uma requisição para a API
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        contents: [{ 
          role: "user", 
          parts: [{ text: userMessage }] 
        }] 
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    // Obtém o texto da resposta e aplica o efeito de digitação
    const apiResponse = data?.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '$1');
    showTypingEffect(apiResponse, textElement, incomingMessageDiv); 
  } catch (error) { 
    isResponseGenerating = false;
    textElement.innerText = error.message;
    textElement.parentElement.closest(".message").classList.add("error");
  } finally {
    incomingMessageDiv.classList.remove("loading");
  }
}

// Função para mostrar uma animação de carregamento enquanto a resposta é gerada
const showLoadingAnimation = () => {
  const html = `<div class="message-content">
                  <img class="avatar" src="img/user.jpg" alt="Gemini avatar">
                  <p class="text"></p>
                  <div class="loading-indicator">
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                    <div class="loading-bar"></div>
                  </div>
                </div>
                <span onClick="copyMessage(this)" class="icon material-symbols-rounded">content_copy</span>`;

  const incomingMessageDiv = createMessageElement(html, "incoming", "loading");
  chatContainer.appendChild(incomingMessageDiv);

  chatContainer.scrollTo(0, chatContainer.scrollHeight); 
  generateAPIResponse(incomingMessageDiv);
}

// Função para copiar mensagens para a área de transferência
const copyMessage = (copyButton) => {
  const messageText = copyButton.parentElement.querySelector(".text").innerText;

  navigator.clipboard.writeText(messageText);
  copyButton.innerText = "done"; // Exibe um ícone de confirmação ao copiar
  setTimeout(() => copyButton.innerText = "content_copy", 1000); 
}

// Função para tratar o envio de mensagens do usuário
const handleOutgoingChat = () => {
  userMessage = typingForm.querySelector(".typing-input").value.trim() || userMessage;
  if(!userMessage || isResponseGenerating) return; 

  isResponseGenerating = true;

  // Cria o elemento de mensagem do usuário
  const html = `<div class="message-content">
                  <img class="avatar" src="img/gemini.svg" alt="User avatar">
                  <p class="text"></p>
                </div>`;

  const outgoingMessageDiv = createMessageElement(html, "outgoing");
  outgoingMessageDiv.querySelector(".text").innerText = userMessage;
  chatContainer.appendChild(outgoingMessageDiv);
  
  typingForm.reset(); 
  document.body.classList.add("hide-header");
  chatContainer.scrollTo(0, chatContainer.scrollHeight); 
  setTimeout(showLoadingAnimation, 500); // Inicia a animação de carregamento
}



deleteChatButton.addEventListener("click", () => {
  if (confirm("Deseja apagar?")) {
    localStorage.removeItem("saved-chats");
    loadDataFromLocalstorage();
  }
});
let textoCapturado = "";
voicechatButton.addEventListener("click", () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Seu navegador não suporta reconhecimento de fala.");
    return;
}

// Cria uma nova instância da API de reconhecimento de fala
const reconhecimento = new webkitSpeechRecognition();

// Define o idioma (português do Brasil)
reconhecimento.lang = "pt-BR";

// Define se o reconhecimento será contínuo (falar várias frases)
reconhecimento.continuous = false;

// Define se os resultados intermediários serão mostrados
reconhecimento.interimResults = false;

// Quando o reconhecimento começar
reconhecimento.onstart = function() {
    document.getElementById("resultado").innerText = "Estou ouvindo...";
};

// Quando o reconhecimento obtiver um resultado
reconhecimento.onresult = function(evento) {
    textoCapturado = evento.results[0][0].transcript; // Armazena o texto na variável
    document.getElementById("resultado").innerText = "Você disse: " + textoCapturado;
    console.log("Texto capturado:", textoCapturado);
    document.getElementById("voz").value=textoCapturado;
    handleOutgoingChat();
     
};

// Quando ocorrer um erro
reconhecimento.onerror = function(evento) {
    document.getElementById("resultado").innerText = "Erro: " + evento.error;
};

// Quando o reconhecimento parar
reconhecimento.start(); 
textoCapturado="";
reconhecimento.onend = function() {
    document.getElementById("resultado").innerText += " (Reconhecimento finalizado)";
    
};


});

suggestions.forEach(suggestion => {
  suggestion.addEventListener("click", () => {
    userMessage = suggestion.querySelector(".text").innerText;
    handleOutgoingChat();
  });
});


typingForm.addEventListener("submit", (e) => {
  e.preventDefault(); 
  handleOutgoingChat();
});

loadDataFromLocalstorage();

const viewHistoryButton = document.getElementById("view-history-button");

viewHistoryButton.addEventListener("click", () => {
    window.location.href = "historico.html"; // Altere para o nome do seu arquivo de histórico
});