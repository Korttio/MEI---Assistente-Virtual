const diasElement = document.getElementById('dias');
const tituloElement = document.getElementById('titulo');
const btnAnterior = document.getElementById('btn-anterior');
const btnProximo = document.getElementById('btn-proximo');
const dataLembreteInput = document.getElementById('data-lembrete');
const textoLembreteInput = document.getElementById('texto-lembrete');
const horaLembreteInput = document.getElementById('hora-lembrete');
const btnAdicionarLembrete = document.getElementById('btn-adicionar-lembrete');
const lembrarDiv = document.getElementById('lembrar');
const textoLembreteAvisar = document.getElementById('texto-lembrete-avisar');
const btnAceitar = document.getElementById('btn-aceitar');
const btnRecusar = document.getElementById('btn-recusar');

let lembretes = {};
let mesAtual = new Date().getMonth();
let anoAtual = new Date().getFullYear();

function atualizarTitulo() {
    tituloElement.textContent = `${new Date(anoAtual, mesAtual).toLocaleString('default', { month: 'long' })} ${anoAtual}`;
}

function renderizarDias() {
    diasElement.innerHTML = '';
    const primeiroDiaDoMes = new Date(anoAtual, mesAtual, 1).getDay();
    const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();

    for (let i = 0; i < primeiroDiaDoMes; i++) {
        const diaVazio = document.createElement('div');
        diasElement.appendChild(diaVazio);
    }

    for (let dia = 1; dia <= diasNoMes; dia++) {
        const diaElemento = document.createElement('div');
        diaElemento.textContent = dia;

        const dataChave = new Date(anoAtual, mesAtual, dia).toISOString().split('T')[0];
        if (lembretes[dataChave]) {
            diaElemento.style.backgroundColor = '#ffeb3b';
            diaElemento.addEventListener('click', () => mostrarLembrete(dataChave, lembretes[dataChave]));
        } else {
            diaElemento.addEventListener('click', () => selecionarDia(dia));
        }

        diasElement.appendChild(diaElemento);
    }
}

function selecionarDia(dia) {
    const dataSelecionada = new Date(anoAtual, mesAtual, dia).toISOString().split('T')[0];
}

function mostrarLembrete(data, lembrete) {
    textoLembreteAvisar.textContent = `Lembrete para ${data}: ${lembrete}`;
    lembrarDiv.style.display = 'block';
}

btnAdicionarLembrete.addEventListener('click', () => {
    const data = dataLembreteInput.value;
    const textoLembrete = textoLembreteInput.value;
    const hora = horaLembreteInput.value;

    if (data && textoLembrete && hora) {
        lembretes[data] = textoLembrete;

        // Configura o alarme
        const lembreteDataHora = new Date(`${data}T${hora}`);
        configurarAlarme(lembreteDataHora, textoLembrete);

        alert('Lembrete adicionado!');
        dataLembreteInput.value = '';
        textoLembreteInput.value = '';
        horaLembreteInput.value = '';
        renderizarDias();
    } else {
        alert('Por favor, preencha a data, hora e o lembrete.');
    }
});

function configurarAlarme(dataHora, lembrete) {
    const agora = new Date();
    const tempoParaLembrete = dataHora - agora;

    if (tempoParaLembrete > 0) {
        setTimeout(() => {
            alert(`Alerta: ${lembrete}`);
            // Opcional: Mostra a opção de aceitar ou recusar após o alarme
            mostrarLembrete(dataHora.toISOString().split('T')[0], lembrete);
        }, tempoParaLembrete);
    } else {
        alert('A data e hora do lembrete já passaram!');
    }
}

btnAceitar.addEventListener('click', () => {
    alert("Lembrete aceito!");
    lembrarDiv.style.display = 'none';
});

btnRecusar.addEventListener('click', () => {
    alert("Lembrete recusado.");
    lembrarDiv.style.display = 'none';
});

btnAnterior.addEventListener('click', () => {
    mesAtual--;
    if (mesAtual < 0) {
        mesAtual = 11;
        anoAtual--;
    }
    atualizarTitulo();
    renderizarDias();
});

btnProximo.addEventListener('click', () => {
    mesAtual++;
    if (mesAtual > 11) {
        mesAtual = 0;
        anoAtual++;
    }
    atualizarTitulo();
    renderizarDias();
});

// Inicializa o calendário
atualizarTitulo();
renderizarDias();

const audioAlarme = new Audio('sounds/dandadan.mp3'); // Caminho para o seu arquivo de som

function configurarAlarme(dataHora, lembrete) {
    const agora = new Date();
    const tempoParaLembrete = dataHora - agora;

    if (tempoParaLembrete > 0) {
        setTimeout(() => {
            audioAlarme.play(); // Toca o som do alarme
            alert(`Alerta: ${lembrete}`);
            mostrarLembrete(dataHora.toISOString().split('T')[0], lembrete);
        }, tempoParaLembrete);
    } else {
        alert('A data e hora do lembrete já passaram!');
    }
}
