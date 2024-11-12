// Função para alternar a exibição do conteúdo (accordion)
function toggleAccordion(element) {
    // Seleciona o conteúdo associado ao item de contato clicado
    const content = element.parentElement.querySelector('.accordion-content');

    // Verifica se o conteúdo está visível (display = "block")
    if (content.style.display === "block") {
        // Se estiver visível, esconde o conteúdo
        content.style.display = "none";
    } else {
        // Caso contrário, exibe o conteúdo
        content.style.display = "block";
    }
}
