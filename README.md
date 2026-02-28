# 💪 Planner Fitness - Progressive Web App (PWA)

> 📲 **Acesse o App funcionando:** [Clique aqui para abrir](https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/)

Um aplicativo web progressivo desenvolvido para auxiliar no acompanhamento e evolução de metas diárias de saúde e condicionamento físico. O projeto transforma um simples checklist de hábitos em uma ferramenta dinâmica que adapta as recomendações com base na biometria e nos objetivos do usuário.

## 🚀 Funcionalidades

- **Cálculo Dinâmico de Metas:** Adapta o consumo diário de água (fórmula de 35ml/kg) e as diretrizes de dieta de acordo com o peso e o objetivo (Déficit ou Superávit Calórico) inseridos nas configurações.
- **Progressão Semanal:** As instruções de treino e cárdio evoluem automaticamente em volume e intensidade da Semana 1 à Semana 4.
- **Armazenamento Local (Data Persistence):** Utilização da API `localStorage` para garantir que o progresso (checkboxes e configurações) não seja perdido ao fechar o navegador.
- **Progressive Web App (PWA):** Suporte a Service Workers e Web Manifest, permitindo a instalação nativa em smartphones (Android/iOS) e funcionamento offline.
- **Interface Responsiva e Acessível:** Layout fluído construído com CSS Grid, garantindo usabilidade tanto em monitores ultrawide quanto em telas mobile.
- **Feedback Visual (Gamificação):** Barra de progresso dinâmica em tempo real que calcula a porcentagem de tarefas concluídas no mês.

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estruturação semântica e integração de Web Manifest.
- **CSS3:** Variáveis nativas (`:root`), CSS Grid, animações (`@keyframes`) e media queries para responsividade.
- **JavaScript (Vanilla):** Manipulação de DOM, cálculos lógicos de progressão, controle de modais e gerenciamento de estado no `localStorage`.
- **Service Workers:** Estratégia de cache de assets estáticos para funcionamento offline.

## ⚙️ Como executar o projeto localmente

1. Clone este repositório:
   ```bash
   git clone https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git
   ```

2. Abra o arquivo `planner.html` no seu navegador.

---
Desenvolvido com foco em performance e usabilidade.