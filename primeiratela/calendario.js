const diasElement = document.getElementById('dias');
const tituloElement = document.getElementById('titulo');
const btnAnterior = document.getElementById('btn-anterior');
const btnProximo = document.getElementById('btn-proximo');
const dataLembrete = document.getElementById('data-lembrete');
const textoLembrete = document.getElementById('texto-lembrete');
const btnAdicionarLembrete = document.getElementById('btn-adicionar-lembrete');

let dataAtual = new Date();
let lembretes = {};

// Carregar lembretes do localStorage
function carregarLembretes() {
    const lembretesSalvos = localStorage.getItem('lembretes');
    if (lembretesSalvos) {
        lembretes = JSON.parse(lembretesSalvos);
    }
}

// Salvar lembretes no localStorage
function salvarLembretes() {
    localStorage.setItem('lembretes', JSON.stringify(lembretes));
}

function gerarCalendario(data) {
    const ano = data.getFullYear();
    const mes = data.getMonth();

    // Definir título do mês
    const opcoes = { year: 'numeric', month: 'long' };
    tituloElement.textContent = data.toLocaleDateString('pt-BR', opcoes);

    // Limpar dias
    diasElement.innerHTML = '';

    // Primeiro dia do mês
    const primeiroDia = new Date(ano, mes, 1);
    const diasNoMes = new Date(ano, mes + 1, 0).getDate();
    const diaDaSemana = primeiroDia.getDay();

    // Adicionar dias vazios
    for (let i = 0; i < diaDaSemana; i++) {
        const diaVazio = document.createElement('div');
        diaVazio.className = 'dia vazio';
        diasElement.appendChild(diaVazio);
    }

    // Adicionar dias do mês
    for (let dia = 1; dia <= diasNoMes; dia++) {
        const diaElement = document.createElement('div');
        diaElement.className = 'dia';
        diaElement.textContent = dia;
        diaElement.dataset.dia = dia;

        // Mostrar lembrete, se existir
        const dataFormatada = `${ano}-${String(mes + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
        if (lembretes[dataFormatada]) {
            const lembreteDiv = document.createElement('div');
            lembreteDiv.className = 'lembrete-dia';
            lembreteDiv.textContent = lembretes[dataFormatada].texto;
            diaElement.appendChild(lembreteDiv);
        }

        diasElement.appendChild(diaElement);
    }
}

btnAnterior.addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() - 1);
    gerarCalendario(dataAtual);
});

btnProximo.addEventListener('click', () => {
    dataAtual.setMonth(dataAtual.getMonth() + 1);
    gerarCalendario(dataAtual);
});

// Função para adicionar lembrete
btnAdicionarLembrete.addEventListener('click', () => {
    const dataSelecionada = dataLembrete.value;
    const texto = textoLembrete.value;

    if (dataSelecionada && texto) {
        lembretes[dataSelecionada] = { texto: texto, data: new Date(dataSelecionada) };
        salvarLembretes(); // Salvar lembretes após adicionar
        alert('Lembrete adicionado!');

        // Configurar alarme
        configurarAlarme(lembretes[dataSelecionada]);

        textoLembrete.value = ''; // Limpar campo de texto
        gerarCalendario(dataAtual); // Atualizar calendário
    } else {
        alert('Por favor, preencha ambos os campos.');
    }
});

// Função para configurar alarme
function configurarAlarme(lembrete) {
    const agora = new Date();
    const tempoParaLembrete = lembrete.data.getTime() - agora.getTime();

    // Se a data do lembrete já passou
    if (tempoParaLembrete <= 0) {
        alert('A data do lembrete já passou!');
        return;
    }

    setTimeout(() => {
        const resposta = confirm(`Lembrete: ${lembrete.texto}\nVocê deseja aceitar?`);
        if (resposta) {
            alert('Lembrete aceito!');
        } else {
            alert('Lembrete recusado.');
        }
    }, tempoParaLembrete);
}

// Carregar lembretes ao iniciar
carregarLembretes();
gerarCalendario(dataAtual);

// Função para salvar lembretes no localStorage
const salvarLembrete = (data, descricao) => {
    const lembretes = JSON.parse(localStorage.getItem("lembretes")) || [];
    lembretes.push({ data, descricao });
    localStorage.setItem("lembretes", JSON.stringify(lembretes));
};

// Exemplo de como usar a função ao adicionar um novo lembrete
document.getElementById("addLembreteBtn").addEventListener("click", () => {
    const data = document.getElementById("dataLembrete").value;
    const descricao = document.getElementById("descricaoLembrete").value;

    if (data && descricao) {
        salvarLembrete(data, descricao);
        alert("Lembrete salvo com sucesso!");
    }
});
