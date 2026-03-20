# Terminal Souls — CLAUDE.md

> TUI-ARPG (Text User Interface Action RPG) / Souls-like + Path of Exile + História da Ciência
> **Versão atual:** v1.2.0 — "A Voz do Exílio" *(em desenvolvimento — Sprint 5 concluído)*
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
- Tipos: ARMA, ARMADURA, ACESSÓRIO, RELÍQUIA, CONSUMÍVEL, TOMO
- Tags: CORTE, ESMAGAMENTO, FOGO, CHOQUE, VAZIO, ESCUDO, REFLEXO, ABSORÇÃO
- Proficiências: Cada tag tem nível (0-5); cada ponto = +5% dano com aquela tag
- **CONSUMÍVEL** tem subtipos: HP, SP, MP, MISTO (campos `recoverHp/recoverSp/recoverMp`); fallback em `recoverValue`
- **TOMO** restaura HP+SP+MP igualmente; processado via `useConsumable()` em Entity.js

### Biomas das Fendas
| Bioma | Cientista | Tema Visual |
|---|---|---|
| Prisma de Newton | Newton | Espectro de luz |
| Singularidade de Hawking | Hawking | Buraco negro |
| Máquina de Turing | Turing | Código binário |
| Vazio de Noether | Noether | Simetria/vácuo |
| Espiral de Euler | Euler | Identidade matemática, espirais |
| Labirinto de Lovelace | Lovelace | Algoritmos, loops, exceções |

### Classes e Skills
- **Guerreiro** (Newton/Galileu/Entropia): tanque físico, skills de impacto e inércia
- **Mago** (Maxwell/Lavoisier/Schrödinger): dano elemental, manipulação quântica
- **Arqueiro** (Einstein/Hawking/Euclides): mobilidade, precisão, efeitos de distância
- **Clérigo** (Hipócrates/Pitágoras): cura, shields geométricos, suporte

---

## 7. Pontos de Atenção no Código

- **Navegação 1-0**: Tratada no final de `src/index.js`; redireciona para a `List` que está em foco (focused list)
- **Status effects**: `Combat.js` usa `target.hasStatus(nome)` / `target.removeStatus(nome)` — métodos em `Entity.js`
- **Prestígio**: Calculado em `Entity.js` — não duplicar lógica
- **HUD / updateStatus()**: Usa `makeBar(current, max, 8)` com `█`/`░`; respeitar os 6 painéis (Status, Sinergias, Legenda, Mapa/Combate, Logs, Análise de Dados)
- **Consumíveis**: `useConsumable()` em Entity.js lê `recoverHp/recoverSp/recoverMp` primeiro; fallback em `recoverValue + consumableType`
- **Mouse desativado**: Intencionalmente. Nunca habilitar — quebra a imersão TUI
- **Persistência**: Saves em `/saves/*.json` via `SaveSystem.js`; não alterar estrutura do JSON sem migração
- **Darwin**: Verifica `c.includes('FORÇA')`, `c.includes('DESTREZA')`, `c.includes('INTELIGÊNCIA')` — maiúsculas obrigatórias
- **Bestiário**: Formato é `{ kills, description, weaknesses, drops, firstSeenFloor, raridade }`. Saves antigos (número simples) são migrados em `_migrateBestiary()` no construtor de Entity.
- **DialogueEngine**: Instância global `dialogueEngine` em `index.js`. Eventos: `firstBossKill`, `level10`, `loreDisco`. Contexto de bioma passado para Darwin via `{ biome: lastBiomeKey }`.
- **prevState**: Variável global em `index.js` que rastreia o estado anterior para navegação correta via ESC. Deve ser definido antes de mudar `gameState` em: `showInventory()`, `showPassives()`, `showBlacksmithSell()`, e ao entrar em `COMBAT_SKILLS`.
- **Tiles LORE**: Tipo `'LORE'` em Dungeon; `tile.data = { biome, text, index }`. Consumido ao ser pisado (vira FLOOR). Renderizado como `? ` no mapa.
- **turnInQuest**: Retorna `{ success: boolean, specialReward: boolean }` — verificar `specialReward` para entregar Tomo Histórico LENDÁRIO em missões LORE.

---

## 8. Estado Atual (v1.2.0) — O que está FEITO

- [x] Combate turn-based com efeitos de status elemental (CHOQUE, CONGELAMENTO, EVASÃO, IMUNIDADE)
- [x] Sinergias de status: CAUTERIZAÇÃO, FRAGMENTAÇÃO, DESCARGA
- [x] Geração procedural de dungeons com biomas temáticos (6 biomas)
- [x] Inimigos temáticos por bioma (4 por bioma, 24 total) + bosses nomeados
- [x] Boss final "SENHOR DA ASCENSÃO" com IA de 3 fases (andar ≥10)
- [x] Progressão RPG completa (atributos, skills, proficiências)
- [x] 20 skills implementadas (5 por classe: Guerreiro, Mago, Arqueiro, Clérigo)
- [x] Sistema de itens expandido: TOMO, consumíveis tipados, 12 efeitos lendários, 20 flavor texts
- [x] Sistema de save persistente (JSON) com migração de formato legado
- [x] Hub Nexus com NPCs vendedores e upgrades (Halthor, Marie, Ada, Darwin)
- [x] Sistema de Bestiário expandido: descrição, fraquezas, drops, raridade, andar do 1º encontro
- [x] Score de Renome Científico (fórmula atualizada com bestiário expandido)
- [x] Navegação unificada por teclado (1-0 universal)
- [x] Boss por andar + drops de Orbes (level×3 / boss level×15)
- [x] Sistema de missões (KILL, FLOOR, ITEM, **LORE**) com auto-progressão — 4 missões no board
- [x] Puzzles (10 padrões matemáticos, 9 tipos)
- [x] Tela de Vitória com Renome Final e créditos
- [x] HUD: barras `makeBar()` com cor por threshold, ícones de status, badge de postura
- [x] Website: tutorial Linux/Windows, sprites ASCII, sistemas core
- [x] **88 testes automatizados** (8 suítes: Entity, Combat, Systems, Skills, Quests, Puzzle, Dialogue, Bestiary)
- [x] Boss Rush mode (7 ondas, NPC Arena no Nexus, Hall of Fame)
- [x] Tela de Game Over com Hall of Fame persistente
- [x] Maestria de Crafting: 4 níveis no Altar de Marie Curie
- [x] Balanceamento logarítmico para andares 10–100
- [x] Sistema de 4 Temas de Cores (DARK/LIGHT/COLORBLIND/NO_RED)
- [x] **DialogueEngine**: diálogos contextuais + eventos únicos para todos os NPCs
- [x] **Tiles LORE**: 18 fragmentos históricos (3/bioma) nos dungeons
- [x] **Navegação ESC corrigida**: COMBAT_SKILLS→COMBAT, TRADE_SELL→Halthor, INVENTORY/SKILLS de exploração→exploração

---

## 9. Roadmap — O que FALTA

### v1.0.1 — Polimento Pós-Lançamento ✅
### v1.1.0 — Conteúdo Expandido ✅
### v1.2.0 — A Voz do Exílio ✅ (Sprint 5 — concluído 2026-03-19)

### v1.4.0 — Legado dos Arquitetos II (Sprint 7 — próximo recomendado)
- [ ] Passivas de Atributo (`src/core/PassiveTree.js`) — 12 passivas, 4 arquétipos
- [ ] Encantamentos de Itens — novo serviço da Marie Curie (100 Orbes)
- [ ] Combos de Skills — sequências que ativam efeito bônus no log de combate
- [ ] Proficiências ESCUDO/REFLEXO/ABSORÇÃO funcionais em `calculateDamage()`

### v1.3.0 — O Arquiteto das Fendas (Sprint 6)
- [ ] Salas especiais por bioma (BIBLIOTECA, ALTAR, CÂMARA_DO_BOSS)
- [ ] Armadilhas e hazards ambientais (tile TRAP)
- [ ] Salas de descanso com menu curto/longo
- [ ] Fog of War visual melhorado (tiles visitados em cinza)

### v1.5.0 — A Mente das Máquinas (Sprint 8)
- [ ] AI Profiles por bioma (Newton=Físico, Turing=Lógico, etc.)
- [ ] Comportamentos táticos (fuga, coordenação em grupo)
- [ ] Bosses com fala ao mudar de fase (`BossDialogue.js`)

### v1.6.0 — Refatoração Arquitetural (Sprint 9 — prerequisito para v2.0)
- [ ] Split de `src/index.js` → GameRenderer, InputHandler, GameState, GameLoop
- [ ] EventBus (`src/core/EventBus.js`)
- [ ] Config centralizado (`src/config.js`)
- [ ] Versionamento de saves com `migrateSave()`
- [ ] 100+ testes

### v2.0.0 — Nexus Online (Sprint 10)
- [ ] Servidor Express + Socket.io
- [ ] Ghosts assíncronos nas fendas
- [ ] Mercado Global de Orbes
- [ ] Leaderboard online

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
