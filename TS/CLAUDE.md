# Terminal Souls — CLAUDE.md

> TUI-ARPG (Text User Interface Action RPG) / Souls-like + Path of Exile + História da Ciência
> **Versão atual:** v1.1.0 — "Conteúdo Expandido" *(lançado)*
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

---

## 8. Estado Atual (v1.1.0) — O que está FEITO

- [x] Combate turn-based com efeitos de status elemental (CHOQUE, CONGELAMENTO, EVASÃO, IMUNIDADE)
- [x] Sinergias de status: CAUTERIZAÇÃO, FRAGMENTAÇÃO, DESCARGA
- [x] Geração procedural de dungeons com biomas temáticos (newton/hawking/turing/noether)
- [x] Inimigos temáticos por bioma (4 por bioma, 16 no total) + bosses nomeados
- [x] Boss final "SENHOR DA ASCENSÃO" com IA de 3 fases (andar ≥10)
- [x] Progressão RPG completa (atributos, skills, proficiências)
- [x] 20 skills implementadas (5 por classe: Guerreiro, Mago, Arqueiro, Clérigo)
- [x] Sistema de itens expandido: TOMO, consumíveis tipados, 12 efeitos lendários, 20 flavor texts
- [x] Sistema de save persistente (JSON)
- [x] Hub Nexus com NPCs vendedores e upgrades (Halthor, Marie, Ada, Darwin)
- [x] Darwin fix: upgrades de STR/DEX/INT funcionando corretamente
- [x] Sistema de Bestiário (tecla B)
- [x] Score de Renome Científico
- [x] Navegação unificada por teclado (1-0 universal)
- [x] Boss por andar + drops de Orbes (level×3 / boss level×15)
- [x] Sistema de missões (KILL, FLOOR, ITEM) com auto-progressão
- [x] Puzzles de Sequência (10 padrões matemáticos) substituindo Minesweeper
- [x] Tela de Vitória com Renome Final e créditos
- [x] HUD: barras `makeBar()` com cor por threshold, ícones de status (⚡❄◎⬡), badge de postura
- [x] Website: tutorial Linux/Windows com abas, seções de sistemas core e biomas
- [x] Website: sprites ASCII completos — 4 combos classe+raça, 5 bosses, 14 inimigos
- [x] 64 testes automatizados (6 suítes: Entity, Combat, Systems, Skills, Quests, Puzzle)
- [x] Boss Rush mode (7 ondas, NPC Arena no Nexus, Hall of Fame)
- [x] 2 novos biomas: A Espiral de Euler e O Labirinto de Lovelace (6 biomas total)
- [x] Tela de Game Over com Hall of Fame persistente (hall_of_fame.json)
- [x] 5 novos tipos de Puzzle (BINARY, LOGIC_TABLE, FORMULA, PRIME_CHECK, MODULO)
- [x] Maestria de Crafting: 4 níveis no Altar de Marie Curie (Aprendiz→Radiante)
- [x] Balanceamento logarítmico para andares 10–100
- [x] Sistema de 4 Temas de Cores (DARK/LIGHT/COLORBLIND/NO_RED) com persistência em settings.json
- [x] Sprite do jogador revertido para `@` simples (melhor legibilidade no grid)

---

## 9. Roadmap — O que FALTA

### v1.0.1 — Polimento Pós-Lançamento ✅
- [x] Balanceamento fino da curva de dificuldade andares 10–100
- [x] Mais variação de puzzles (novos padrões de sequência)
- [x] Tela de Game Over com Renome registrado

### v1.1.0 — Conteúdo Expandido ✅
- [x] Boss Rush mode ✅
- [x] Maestria de Crafting ✅
- [x] Biomas adicionais (Euler e Lovelace) ✅

### v1.2.0+ — Pós-Lançamento (Multiplayer)
- [ ] **Nexus Online**: Hub compartilhado via Socket.io
- [ ] **Mercado Global**: Trade entre jogadores
- [ ] **Espectros Assíncronos**: Ver mortes de outros jogadores no mapa
- [ ] Biomas 7-8 (além dos 6 core)
- [ ] Boss Rush expandido (ondas extras, modificadores)
- [ ] Itens de Lore & Crônicas (história do Exílio)

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
