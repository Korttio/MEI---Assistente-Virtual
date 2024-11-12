// Adiciona um evento ao botão "location-button" para capturar o clique
document.getElementById("location-button").addEventListener("click", function() {
    // Verifica se o navegador suporta a API de Geolocalização
    if (navigator.geolocation) {
        // Tenta obter a posição atual do usuário
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        // Exibe uma mensagem se a geolocalização não for suportada
        alert("Geolocalização não é suportada neste navegador.");
    }
});

// Função para processar e exibir a posição do usuário
function showPosition(position) {
    const latitude = position.coords.latitude; // Obtém a latitude
    const longitude = position.coords.longitude; // Obtém a longitude
    
    // URL da API Nominatim do OpenStreetMap para obter o endereço a partir das coordenadas
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`;

    // Realiza uma solicitação para a API usando fetch
    fetch(url)
        .then(response => response.json()) // Converte a resposta para JSON
        .then(data => {
            // Extrai informações do endereço obtido
            const address = data.address;
            const state = address.state || "Estado não disponível"; // Estado
            const postcode = address.postcode || "CEP não disponível"; // CEP
            const city = address.city || address.town || address.village || "Cidade não disponível"; // Cidade
            const neighborhood = address.suburb || address.neighbourhood || "Bairro não disponível"; // Bairro

            // Monta a saída de localização
            const locationOutput = document.getElementById("location-output");
            locationOutput.innerHTML = `
                <strong>Localização:</strong><br>
                Estado: ${state}<br>
                CEP: ${postcode}<br>
                Cidade: ${city}<br>
                Bairro: ${neighborhood}
            `;
        })
        .catch(error => {
            // Exibe o erro no console caso ocorra
            console.error("Erro ao obter o endereço:", error);
        });
}

// Função para lidar com erros na obtenção da posição
function showError(error) {
    // Identifica o tipo de erro e exibe uma mensagem apropriada
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Usuário negou a solicitação de Geolocalização.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("A localização não está disponível.");
            break;
        case error.TIMEOUT:
            alert("A solicitação para obter a localização do usuário expirou.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Um erro desconhecido ocorreu.");
            break;
    }
}
