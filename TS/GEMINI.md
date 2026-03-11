# Terminal Souls

> TUI-ARPG (Text User Interface Action RPG) / Multiplayer Assíncrono e Hub Social

---

## Stack & Runtime

- **Linguagem:** JavaScript (Node.js v18+)
- **Runtime:** Node.js
- **Framework:** Blessed (TUI Layout), Inquirer (Menus), Socket.io (Multiplayer), Math.js (Puzzles)
- **Gerenciador de pacotes:** npm
- **Banco de dados:** MariaDB (Relacional: Players/Itens) e Firestore (NoSQL: Sessões/Logs)

---

## Estrutura de Diretórios

```
/run/media/jpmtg/SSD SATA III/TS - 0.0.1 (google)/
├── GDD.md          # Game Design Document (The Echoes of Exile)
└── MVP.md          # MVP Scope and Implementation Status
```

---

## Comandos Essenciais

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Iniciar jogo (Production/Demo)
npm start

# Rodar todos os testes
npm test

# Lint / format
<!-- could not detect — fill manually -->
```

---

## Convenções de Código

- **Estilo:** CommonJS (require/module.exports), modular
- **Nomenclatura:** camelCase para funções/variáveis, PascalCase para classes, SCREAMING_SNAKE_CASE para constantes.
- **Commits:** Conventional Commits (feat, fix, refactor, chore...)
- **Branches:** <!-- could not detect — fill manually -->
- **Testes:** Jest <!-- inferred from typical Node.js projects and reference -->

---

## Contexto de Domínio

<!-- Inferred from GDD.md and MVP.md: Terminal Souls is a TUI-based MMORPG (The Echoes of Exile) that blends the deliberate, punishing combat of Dark Souls with the deep build complexity and loot systems of Path of Exile. It features a turn-based combat system with resources (Stamina/Mana/HP), posture mechanics (Attack/Balanced/Defence), and a "Nexus" global hub for social interaction and trade. -->

---

## Restrições e Decisões Arquiteturais

- **Interface:** TUI imersiva usando as bibliotecas `blessed`, `chalk` e `inquirer`.
- **Persistência Híbrida:** MariaDB para dados relacionais persistentes e Firestore para persistência de sessões temporárias e logs.
- **Arquitetura:** Baseada em Node.js assíncrono, com instâncias de combate privadas ("Fendas") e um hub compartilhado ("Nexus").
- **Geração Procedural:** Dungeons e Puzzles (matemáticos/lógicos) são gerados proceduralmente.

---

## O que o Ragnarok NUNCA deve fazer neste projeto

- [ ] Modificar esquemas do banco de dados sem verificar compatibilidade com UUIDs de itens.
- [ ] Alterar o sistema de Stagger sem considerar o balanceamento de Exaustão Física/Mágica.

---

## Contexto Adicional

O projeto está em fase de MVP (v0.0.1). O combate foca em "Intelecto como Arma", exigindo resolução de puzzles para acessar loot de alto nível ou evitar penalidades. Existe uma forte ênfase em sinergias de itens e "tags" (Corte, Fogo, Choque, etc.) para criação de builds min-maxing.
