# Terminal Souls — CLAUDE.md

> TUI-ARPG (Text User Interface Action RPG) / Souls-like + Path of Exile + História da Ciência
> **Versão atual:** v0.9.9.1 — "O Renome do Exilado"
> **Autor:** João Pedro Melloni Tardif Germano

---

## 1. Visão e Filosofia

Terminal Souls é um ARPG jogado inteiramente no terminal, mesclando o combate punitivo de Dark Souls com a profundidade de builds de Path of Exile, todo ambientado num universo de ciência e matemática.

**Pilares de Design:**
- **Intelecto como Arma** — combate exige resolução de puzzles, não só reflexos
- **Ecos da Razão** — dungeons temáticas de Newton, Hawking, Turing, Noether, Euler, Lovelace
- **Legado dos Arquitetos** — skill trees baseadas em teoremas e leis físicas
- **Renome Científico** — score de prestígio cresce com nível, atributos, itens raros e bestiário
- **Hardcore** — morte permanente com deleção do save; Renome é registrado eternamente

---

## 2. Stack Técnico

| Componente | Tecnologia |
|---|---|
| Runtime | Node.js v18+ |
| UI/Layout | Blessed (TUI) |
| Cores | Chalk v4 |
| Menus | Inquirer v8 |
| Puzzles | Math.js |
| IDs | uuid |
| Multiplayer (futuro) | Socket.io |
| Testes | Jest |
| Dev watch | nodemon |

**Estilo de código:**
- CommonJS (`require` / `module.exports`) — não usar ES modules
- camelCase para funções/variáveis, PascalCase para classes, SCREAMING_SNAKE_CASE para constantes
- Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`

---

## 3. Estrutura de Diretórios

```
TS/
├── src/
│   ├── index.js              # Loop principal, UI (blessed), entrada de teclas — arquivo mais crítico
│   ├── entities/
│   │   └── Entity.js         # Classe Player/Enemy: stats, equipamentos, skills, cálculo de Renome
│   ├── combat/
│   │   └── Combat.js         # Sistema de combate turn-based; usa target.hasStatus para efeitos
│   ├── core/
│   │   ├── Dungeon.js        # Geração procedural do grid e biomas
│   │   ├── Puzzle.js         # Puzzles matemáticos/históricos
│   │   ├── QuestBoard.js     # Sistema de missões procedurais
│   │   ├── Nexus.js          # Hub NPCs (Halthor, Marie, Ada, Darwin)
│   │   └── SaveSystem.js     # Persistência JSON em /saves/
│   ├── items/
│   │   ├── Item.js           # Definição de itens, raridades, tags, flavor text
│   │   ├── Blacksmith.js     # Loja de compra/venda (Halthor)
│   │   └── CraftingAltar.js  # Transmutação de atributos (Marie Curie)
│   └── ui/
│       └── Sprites.js        # Sprites ASCII de personagens e bosses
├── tests/
│   ├── Entity.test.js
│   ├── Combat.test.js
│   └── Systems.test.js
├── docs/                     # Landing page estática (CRT aesthetic)
│   ├── index.html
│   ├── style.css
│   └── script.js
├── saves/                    # Saves JSON gerados em runtime (gitignored)
├── GDD.md                    # Game Design Document completo
├── MVP.md                    # Roadmap e fases de desenvolvimento
├── patchnotes.md             # Histórico de versões
├── tutorial.md               # Guia do jogador
└── package.json
```

---

## 4. Comandos Essenciais

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento (hot-reload)
npm run dev

# Rodar (produção/demo)
npm start

# Rodar testes
npm test
```

---

## 5. Gameplay Loop

```
NEXUS (hub seguro) → FENDA (dungeon procedural) → COMBATE (turn-based) → LOOT & XP → NEXUS
```

**Nexus — NPCs:**
- **Halthor** (Ferreiro): Compra/vende equipamentos, troca loot por Orbes
- **Marie Curie** (Altar): Reroll de atributos de itens, transmutação (50 Orbes)
- **Ada** (Algoritmos): Troca Orbes por pontos de Skill extras
- **Darwin** (Evolução): Troca Orbes por boosts permanentes de STR/DEX/INT
- **Quadro de Missões**: Missões procedurais (matar X inimigos, explorar Y andares)

**Controles (teclado puro):**
| Tecla | Ação |
|---|---|
| WASD | Movimento no mapa |
| H | Menu de Atributos |
| P | Menu de Proficiências |
| I | Inventário |
| B | Bestiário |
| 1-0 | Navegar/interagir em qualquer lista |
| Q / ESC | Voltar/sair de menu |
| Space / Enter | Confirmar |

---

## 6. Sistemas Core

### Estabilidade Cinética (Postura)
- Substitui HP tradicional; base = 100 + (DEX × 5)
- **INÉRCIA** (defensivo): -50% dano causado, +100% defesa, recupera Estabilidade
- **MOMENTO** (ofensivo): +50% dano, drena Estabilidade por turno
- **EQUILÍBRIO** (neutro): Estado padrão para combos de reação

### Renome Científico (Score)
Calculado em `src/entities/Entity.js`:
```
Renome = (Nível × 100) + (TotalAtributos × 10) + BonusSkills + DescobertasBestiário
```

### Sistema de Itens
- Raridades: Comum → Incomum → Raro → Lendário
- Tipos: ARMA, ARMADURA, ACESSÓRIO, RELÍQUIA
- Tags: CORTE, ESMAGAMENTO, FOGO, CHOQUE, VAZIO
- Proficiências: Cada tag tem nível (0-5); cada ponto = +5% dano com aquela tag

### Biomas das Fendas
| Bioma | Cientista | Tema Visual |
|---|---|---|
| Prisma de Newton | Newton | Espectro de luz |
| Singularidade de Hawking | Hawking | Buraco negro |
| Máquina de Turing | Turing | Código binário |
| Vazio de Noether | Noether | Simetria/vácuo |

### Classes e Skills
- **Guerreiro** (Newton/Galileu/Entropia): tanque físico, skills de impacto e inércia
- **Mago** (Maxwell/Lavoisier/Schrödinger): dano elemental, manipulação quântica
- **Arqueiro** (Einstein/Hawking/Euclides): mobilidade, precisão, efeitos de distância
- **Clérigo** (Hipócrates/Pitágoras): cura, shields geométricos, suporte

---

## 7. Pontos de Atenção no Código

- **Navegação 1-0**: Tratada no final de `src/index.js`; redireciona para a `List` que está em foco (focused list)
- **Status effects**: `Combat.js` usa `target.hasStatus(nome)` para verificar efeitos ativos
- **Prestígio**: Calculado em `Entity.js` — não duplicar lógica
- **Layout TUI**: Modificações no blessed devem respeitar o layout de 6 painéis (Status, Sinergias, Legenda, Mapa/Combate, Logs, Análise de Dados)
- **Mouse desativado**: Intencionalmente. Nunca habilitar — quebra a imersão TUI
- **Persistência**: Saves em `/saves/*.json` via `SaveSystem.js`; não alterar estrutura do JSON sem migração

---

## 8. Estado Atual (v0.9.9.1) — O que está FEITO

- [x] Combate turn-based com efeitos de status elemental
- [x] Geração procedural de dungeons com biomas temáticos
- [x] Progressão RPG completa (atributos, skills, proficiências)
- [x] Sistema de itens com raridades e crafting
- [x] Sistema de save persistente (JSON)
- [x] Hub Nexus com NPCs vendedores e upgrades
- [x] Sistema de Bestiário (tecla B)
- [x] Score de Renome Científico
- [x] Navegação unificada por teclado (1-0 universal)
- [x] Boss por andar
- [x] Website landing page com calculadora de Renome e galeria de sprites

---

## 9. Roadmap — O que FALTA

### v1.0.0 — Lançamento Single-Player
- [ ] **Boss Final**: "O Arquiteto do Exílio" (Andar 100)
- [ ] **Balanceamento** da curva de dificuldade até o Andar 100
- [ ] **Créditos** e sequência de finalização do jogo

### v1.1.0+ — Pós-Lançamento (Multiplayer)
- [ ] **Nexus Online**: Hub compartilhado via Socket.io
- [ ] **Mercado Global**: Trade entre jogadores
- [ ] **Espectros Assíncronos**: Ver mortes de outros jogadores no mapa
- [ ] Biomas adicionais além dos 4 core
- [ ] Boss Rush mode
- [ ] Itens de Lore & Crônicas (história do Exílio)
- [ ] Maestria de Crafting (níveis para o Altar)

---

## 10. Restrições Arquiteturais

- Nunca usar ES modules (`import/export`) — projeto usa CommonJS
- Nunca habilitar mouse no blessed
- Nunca alterar JSON dos saves sem criar migração
- Nunca modificar o sistema de Stagger sem considerar o balanceamento de Estabilidade Cinética
- Multiplayer (Socket.io) está nas dependências mas **não implementado** — não ativar prematuramente

---

## Arquivos críticos para ler antes de qualquer mudança
- `src/index.js` — UI, game loop, input handler
- `src/entities/Entity.js` — stats, Renome, equipamentos
- `src/combat/Combat.js` — sistema de combate
- `GDD.md` — decisões de design
