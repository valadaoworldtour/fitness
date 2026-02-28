document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById('planner-grid');
    const diasSemana = ['SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];
    const metas = ['CÁRDIO', 'TREINO', 'ÁGUA', 'SONO', 'DIETA'];

    // 1. Gerar os cabeçalhos (Dias da semana)
    grid.innerHTML += `<div class="empty-cell"></div>`;
    diasSemana.forEach(dia => {
        grid.innerHTML += `<div class="day-header">${dia}</div>`;
    });

    // 2. Gerar as semanas (4 Semanas) e as caixas de metas
    for (let semana = 1; semana <= 4; semana++) {
        // Rótulo vertical da semana
        grid.innerHTML += `<div class="week-label"><span>SEMANA ${semana}</span></div>`;

        // Caixas de cada dia (6 dias por semana)
        for (let dia = 1; dia <= 6; dia++) {
            let offset = (semana - 1) * 7 + (dia - 1);
            let metasHtml = metas.map((meta, indexMeta) => {
                // Criamos um ID único para cada checkbox para podermos salvar o estado
                let uniqueId = `s${semana}d${dia}m${indexMeta}`;
                return `
                    <div class="task-row">
                        <input type="checkbox" id="${uniqueId}" onchange="salvarProgresso('${uniqueId}')">
                        <span class="task-name" onclick="abrirModal('${meta}', ${semana})">${meta} <span class="info-icon">?</span></span>
                    </div>
                `;
            }).join('');
            
            grid.innerHTML += `
                <div class="day-card">
                    <div class="day-card-header">
                        <span class="mobile-day-label">${diasSemana[dia-1]}</span>
                        <div class="card-date" data-offset="${offset}"></div>
                    </div>
                    ${metasHtml}
                </div>`;
        }
    }

    // 3. Carregar progresso salvo (LocalStorage)
    carregarProgresso();
    carregarConfig(); // Carrega as configurações do usuário
});

// Função para salvar estado do checkbox
function salvarProgresso(id) {
    const checkbox = document.getElementById(id);
    localStorage.setItem(id, checkbox.checked);
    atualizarProgresso();
}

// Função para carregar estado ao abrir a página
function carregarProgresso() {
    // Carrega checkboxes
    const inputs = document.querySelectorAll('input[type="checkbox"]');
    inputs.forEach(input => {
        const checked = localStorage.getItem(input.id);
        if (checked === 'true') {
            input.checked = true;
        }
    });

    // Carrega e salva a data de início
    const dataInput = document.getElementById('data-inicio');
    const dataSalva = localStorage.getItem('dataInicio');
    if(dataSalva) dataInput.value = dataSalva;

    dataInput.addEventListener('change', (e) => {
        localStorage.setItem('dataInicio', e.target.value);
        atualizarDatas();
    });
    
    atualizarDatas();
    atualizarProgresso();
}

function atualizarDatas() {
    const dataInput = document.getElementById('data-inicio');
    if (!dataInput.value) return;

    // Adiciona T12:00:00 para evitar problemas de fuso horário subtraindo um dia
    const dataInicio = new Date(dataInput.value + 'T12:00:00');
    const displays = document.querySelectorAll('.card-date');

    displays.forEach(div => {
        const offset = parseInt(div.dataset.offset);
        const dataAtual = new Date(dataInicio);
        dataAtual.setDate(dataInicio.getDate() + offset);
        
        const dia = String(dataAtual.getDate()).padStart(2, '0');
        const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
        div.textContent = `${dia}/${mes}`;
    });
}

function atualizarProgresso() {
    const total = document.querySelectorAll('input[type="checkbox"]').length;
    const marcados = document.querySelectorAll('input[type="checkbox"]:checked').length;
    const porcentagem = total === 0 ? 0 : Math.round((marcados / total) * 100);
    const barra = document.getElementById('progress-bar');
    barra.style.width = `${porcentagem}%`;
    barra.innerText = `${porcentagem}%`;
}

function resetarPlanner() {
    if (confirm("Tem certeza que deseja apagar todo o progresso e iniciar um novo mês?")) {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            cb.checked = false;
            localStorage.removeItem(cb.id);
        });
        atualizarProgresso();
    }
}

// --- LÓGICA DINÂMICA E CONFIGURAÇÕES ---

// Valores padrão caso o usuário nunca tenha configurado
let userProfile = {
    peso: 69,
    objetivo: 'massa' // 'massa' ou 'perda'
};

function getInstrucao(meta, semana) {
    // Cálculo Dinâmico de Água (35ml por kg)
    const litrosAgua = (userProfile.peso * 0.035).toFixed(1).replace('.', ',');
    const metaAgua = `<strong>Meta: ${litrosAgua} Litros/dia</strong><br>Dica: Beba 500ml logo ao acordar. Calculado para seu peso de ${userProfile.peso}kg.`;
    
    // Dicas de Dieta baseadas no Objetivo
    let focoDieta = userProfile.objetivo === 'massa' ? 'Superávit Calórico (Comer mais)' : 'Déficit Calórico (Comer menos)';
    let dicaExtra = userProfile.objetivo === 'massa' ? 'Não pule refeições. Adicione carboidratos complexos.' : 'Aumente a proteína e controle os carboidratos.';
    
    const metaDieta = `<strong>Foco: ${focoDieta}</strong><br>
        - <strong>Estratégia:</strong> ${dicaExtra}<br>
        - <strong>Saúde:</strong> Priorize alimentos ricos em Ferro (feijão, carnes) e evite abacaxi (alergia).`;

    const metaSono = 'Dormir 7h-8h é inegociável para a imunidade e para o músculo crescer. O crescimento acontece no descanso, não no treino.';

    if (meta === 'ÁGUA') return metaAgua;
    if (meta === 'DIETA') return metaDieta;
    if (meta === 'SONO') return metaSono;

    if (meta === 'CÁRDIO') {
        // Se for perda de peso, o cardio é mais intenso. Se for massa, é moderado.
        const isPerda = userProfile.objetivo === 'perda';
        
        if (semana === 1) return `<strong>Semana 1:</strong> Caminhada ${isPerda ? 'rápida' : 'leve'} de 20 min.`;
        if (semana === 2) return `<strong>Semana 2:</strong> Caminhada ${isPerda ? 'rápida' : 'moderada'} de 25 min.`;
        if (semana === 3) return `<strong>Semana 3:</strong> ${isPerda ? 'Trote leve ou Caminhada rápida' : 'Caminhada acelerada'} de 30 min.`;
        return `<strong>Semana 4:</strong> ${isPerda ? '30 min de Corrida leve/Trote' : '30 min de Caminhada rápida'}.`;
    }

    if (meta === 'TREINO') {
        // Treino em Casa (Calistenia Básica) - Progressão de Volume
        const base = "<strong>Treino em Casa (Peso do Corpo):</strong><br>";
        if (semana === 1) return base + "Adaptação: 3x10 Agachamentos, 3x8 Flexões (joelhos no chão se precisar), 3x20s Prancha.";
        if (semana === 2) return base + "Volume: 3x12 Agachamentos, 3x10 Flexões, 3x30s Prancha. Adicione: 3x10 Afundo (cada perna).";
        if (semana === 3) return base + "Intensidade: 4x12 Agachamentos, 4x12 Flexões, 4x40s Prancha. Intervalos curtos (45s).";
        return base + "Desafio: Tente chegar à falha (máximo que conseguir) na última série de cada exercício.";
    }
}

function abrirModal(meta, semana) {
    const modal = document.getElementById('info-modal');
    const titulo = document.getElementById('modal-title');
    const desc = document.getElementById('modal-desc');

    titulo.innerText = `${meta} - SEMANA ${semana}`;
    desc.innerHTML = getInstrucao(meta, semana);
    
    modal.style.display = 'flex';
}

function fecharModal(event, force = false) {
    // Fecha se clicar no botão (force=true) ou se clicar fora da caixa branca (no overlay)
    if (force || event.target.id === 'info-modal') {
        document.getElementById('info-modal').style.display = 'none';
    }
}

// Funções do Menu de Configurações
function abrirConfig() {
    // Preenche os campos com os valores atuais
    document.getElementById('conf-peso').value = userProfile.peso;
    document.getElementById('conf-objetivo').value = userProfile.objetivo;
    document.getElementById('config-modal').style.display = 'flex';
}

function fecharConfig(event) {
    if (event.target.id === 'config-modal') {
        document.getElementById('config-modal').style.display = 'none';
    }
}

function salvarConfig() {
    const peso = parseFloat(document.getElementById('conf-peso').value);
    const objetivo = document.getElementById('conf-objetivo').value;

    if (peso && objetivo) {
        userProfile = { peso, objetivo };
        localStorage.setItem('fitnessProfile', JSON.stringify(userProfile));
        alert('Configurações salvas! Suas metas foram recalculadas.');
        document.getElementById('config-modal').style.display = 'none';
    }
}

function carregarConfig() {
    const savedProfile = localStorage.getItem('fitnessProfile');
    if (savedProfile) {
        userProfile = JSON.parse(savedProfile);
    }
}

// --- LÓGICA DE INSTALAÇÃO PWA ---
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Previne que o navegador mostre o banner padrão imediatamente
    e.preventDefault();
    // Guarda o evento para acionar depois
    deferredPrompt = e;
    // Mostra o nosso botão customizado
    const installBtn = document.getElementById('install-btn');
    installBtn.style.display = 'block';

    installBtn.addEventListener('click', () => {
        // Esconde o botão pois a instalação vai começar
        installBtn.style.display = 'none';
        // Mostra o prompt de instalação nativo
        deferredPrompt.prompt();
        // Espera a escolha do usuário
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('Usuário aceitou a instalação');
            }
            deferredPrompt = null;
        });
    });
});