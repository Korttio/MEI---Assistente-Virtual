// Função para mostrar uma seção específica e esconder as outras
function showSection(sectionId) {
    // Seleciona todas as seções de configurações
    const sections = document.querySelectorAll('.settings-section');
    
    // Para cada seção, define o estilo 'display' como 'none', escondendo a seção
    sections.forEach(section => {
        section.style.display = 'none';
    });

    // Seleciona a seção ativa que deve ser mostrada usando o ID passado como argumento
    const activeSection = document.getElementById(sectionId);
    
    // Verifica se a seção existe, e se existir, define o estilo 'display' como 'block' para torná-la visível
    if (activeSection) {
        activeSection.style.display = 'block';
    }
}

// Função para esconder todas as seções
function hideSection() {
    // Seleciona todas as seções de configurações
    const sections = document.querySelectorAll('.settings-section');
    
    // Para cada seção, define o estilo 'display' como 'none', escondendo todas as seções
    sections.forEach(section => {
        section.style.display = 'none';
    });
}

// Função para salvar as configurações de perfil
function saveProfileSettings() {
    // Obtém o valor do campo de entrada de nome do perfil
    const nameInput = document.getElementById('name-input').value;
    
    // Salva o nome do perfil no armazenamento local (localStorage)
    localStorage.setItem('profileName', nameInput);
    
    // Exibe uma mensagem de sucesso
    alert('Nome do perfil salvo com sucesso!');
}

// Esta função parece ser uma duplicata da anterior e possui o mesmo nome.
// Ela salva o nome do perfil e a imagem do perfil (se fornecida)
function saveProfileSettings() {
    // Obtém o valor do campo de entrada de nome do perfil
    const nameInput = document.getElementById('name-input').value;
   
    // Salva o nome do perfil no armazenamento local (localStorage)
    localStorage.setItem('profileName', nameInput);
    
    // Obtém o campo de seleção de imagem de perfil
    const profilePicInput = document.getElementById('profile-pic-input');
    
    // Verifica se há um arquivo de imagem selecionado
    if (profilePicInput.files && profilePicInput.files[0]) {
        // Cria um objeto FileReader para ler o arquivo de imagem
        const reader = new FileReader();
        
        // Quando a imagem for carregada, salva o conteúdo da imagem no armazenamento local
        reader.onload = function (e) {
            localStorage.setItem('profilePic', e.target.result);
            // Exibe uma mensagem de sucesso
            alert('Nome e imagem do perfil salvos com sucesso!');
        }
        
        // Lê o arquivo de imagem como uma URL de dados (Data URL)
        reader.readAsDataURL(profilePicInput.files[0]);
    } else {
        // Se não houver imagem, apenas salva o nome do perfil
        alert('Nome do perfil salvo com sucesso!');
    }
}
