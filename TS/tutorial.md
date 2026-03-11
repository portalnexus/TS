# Tutorial: Terminal Souls (v0.0.1 - MVP)

Bem-vindo ao guia de inicialização e testes do **Terminal Souls**. Este documento orienta como configurar o ambiente, executar o jogo e validar as mecânicas principais.

---

## 1. Pré-requisitos

Certifique-se de ter instalado em sua máquina:
- **Node.js**: Versão 18.0.0 ou superior.
- **npm**: Gerenciador de pacotes do Node (instalado automaticamente com o Node.js).

---

## 2. Instalação

Abra o terminal na pasta raiz do projeto e execute o comando abaixo para instalar as dependências necessárias (`blessed`, `chalk`, `mathjs`, etc.):

```bash
npm install
```

---

## 3. Como Jogar

Para iniciar a interface do jogo (TUI), execute:

```bash
npm start
```

### Controles Básicos:
- **Setas (Cima/Baixo)**: Navegar entre as opções do menu.
- **ENTER**: Confirmar a ação selecionada.
- **ESC / Q / Ctrl+C**: Sair do jogo a qualquer momento.
- **Teclado**: Digitar respostas para os Puzzles Matemáticos quando solicitado.

---

## 4. Guia de Testes (Manual)

Para validar se o MVP está funcionando corretamente, siga este roteiro de teste:

### Teste A: Exploração e Geração
1. No menu principal, selecione **[1] Entrar na Fenda**.
2. Verifique se o log exibe "SALA 1/X" e o tipo da sala (COMBAT, TREASURE, etc.).
3. Confirme se as barras de status (HP/SP/MP) no canto esquerdo estão atualizadas.

### Teste B: Combate e Postura
1. Ao encontrar inimigos, selecione **[A] ATACAR**.
2. Verifique se o valor de **SP (Stamina)** diminui após o ataque.
3. Selecione **[P] MUDAR POSTURA** e veja se o status muda entre `ATTACK`, `BALANCED` e `DEFENCE`.
4. Deixe sua Stamina chegar a 0 e verifique se o rótulo `EXAUSTÃO FÍSICA` aparece (isso dobra o dano que você recebe).

### Teste C: Puzzles
1. Entre em uma sala do tipo **PUZZLE**.
2. Leia a expressão matemática no log.
3. Digite a resposta no campo azul que aparecerá abaixo e aperte **ENTER**.
4. Verifique se você recebe XP em caso de acerto ou perde HP em caso de erro.

### Teste D: Loot e Inventário
1. Após vencer um combate ou abrir um tesouro, verifique se o nome de um item (colorido por raridade) aparece no log.
2. Selecione **[2] Ver Inventário** para listar seus itens coletados.

---

## 5. Testes Automatizados (Em breve)

O projeto está configurado para usar **Jest**. Para rodar a suíte de testes (atualmente em expansão):

```bash
npm test
```

---

## 6. Troubleshooting (Resolução de Problemas)

- **Caracteres Estranhos**: Se a interface parecer quebrada, certifique-se de que seu terminal suporta UTF-8 e cores (recomenda-se VS Code Terminal, iTerm2 ou Windows Terminal).
- **Erro de Módulo não encontrado**: Execute `npm install` novamente para garantir que todas as bibliotecas foram baixadas.

---
*"O caminho do Exilado é árduo, mas a recompensa é eterna."*
