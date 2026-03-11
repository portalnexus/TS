# MVP - TERMINAL SOULS
**Versão:** 0.0.1
**Status:** **INCOMPLETO**

---

## 1. OBJETIVO ORIGINAL

Criar um protótipo jogável que valide os pilares centrais:
- Combate turn-based punitivo (Stamina/Mana/HP)
- Sistema de Postura (Attack/Balanced/Defence)
- Tags de dano e sinergias básicas
- Geração procedural de uma Fenda simples
- Loot com raridades e afixos
- Interface TUI funcional com Blessed + Chalk

---

## 2. ESTRUTURA DE PASTAS

```
Terminal Souls/
├── src/
│   ├── index.js           # Entry point, game loop
│   ├── core/
│   │   ├── Dungeon.js     # Fendas procedurais
│   │   └── Puzzle.js      # Puzzles matemáticos
│   ├── combat/
│   │   └── Combat.js      # Sistema de combate
│   ├── entities/
│   │   └── Entity.js      # Player/Inimigo
│   ├── items/
│   │   └── Item.js        # Loot e consumíveis
│   └── ui/
│       └── TUI.js         # Interface Blessed
├── data/                  # Saves (futuro)
├── package.json
├── README.md
├── MVP.md
└── GDD.md
```

---

## 3. REQUISITOS TÉCNICOS

### Dependências
```json
{
  "blessed": "^0.1.81",
  "chalk": "^4.1.2",
  "uuid": "^13.0.0"
}
```

### Node.js: v18+

---

## 4. SISTEMAS IMPLEMENTADOS

### 4.1 Entidades (Entity.js)
- Player e Inimigos com stats completos
- Sistema de Postura com modificadores
- **Sistema de Stagger** (Barra de Postura 0-100)
- Exaustão Física e Mágica
- Equipamento (arma, armadura, acessório)

### 4.2 Combate (Combat.js)
- Turnos alternados
- Ações: Atacar, Skill, Recuperar, Mudar Postura
- **Dano de Postura** e **Stagger**
- Inimigo atordoado perde turno e recebe crítico
- IA básica de inimigos
- Tags: Corte, Fogo, Choque, Sangramento

### 4.3 Fendas/Dungeons (Dungeon.js)
- **Geração procedural de salas**
- 5 tipos de sala: Combate, Puzzle, Tesouro, Descanso, Boss
- 4 dificuldades: Fácil, Normal, Difícil, Extremo
- Sistema de Andares progressivo
- 6 tipos de inimigos + 1 Boss

### 4.4 Puzzles (Puzzle.js)
- **Expressões Matemáticas** procedurais
- **Equações do 1º grau**
- **Charadas** de lógica
- **Campo Minado** jogável
- Escalonamento por dificuldade
- Recompensas: XP e itens

### 4.5 Loot e Itens (Item.js)
- 4 raridades: Comum, Mágico, Raro, Lendário
- Geração com UUID único
- Afixos aleatórios (+HP, +Stamina, +Dano, etc.)
- **Itens Lendários com efeitos únicos**
- **Consumíveis** (poções de HP, SP, MP)
- Equipamento de armas, armaduras, acessórios

### 4.6 Interface (TUI.js)
- Barras de HP/SP/MP/Postura coloridas
- Log de combate scrollável
- Inventário interativo
- Status de stagger/exaustão
- Renderização de campo minado

### 4.7 Game Loop (index.js)
- Menu Principal
- **Nexus Hub** (área segura)
- Exploração de Fenda
- Combate
- Puzzles
- Tesouros
- Level Up e Morte

---

## 5. CRITÉRIOS DE ACEITE - TODOS ATENDIDOS

- [ ] Player consegue entrar em uma Fenda
- [ ] Combate contra múltiplos inimigos funciona
- [ ] Sistema de postura afeta dano/defesa
- [ ] **Sistema de Stagger/Quebra de Postura**
- [ ] Exaustão de Stamina/Mana aplica penalidade 2x
- [ ] Inimigos dropam loot com raridade
- [ ] Inventário mostra itens coloridos por raridade
- [ ] Morte causa perda de 50% XP
- [ ] **Puzzles matemáticos e charadas**
- [ ] **Campo Minado funcional**
- [ ] **Boss no final da dungeon**
- [ ] **Sistema de Andares/Dificuldade progressiva**
- [ ] **Uso de consumíveis (poções)**
- [ ] **Nexus Hub como área segura**

---

## 6. CONTEÚDO ATUAL

### Inimigos (6 tipos + Boss)
| Nome | Tags | Dificuldade |
|------|------|-------------|
| Guerreiro Caído | Corte, Sangramento | Normal |
| Esqueleto Maldito | Corte, Vazio | Fácil |
| Lobo Corrompido | Corte | Fácil |
| Bandido Exilado | Corte, Choque | Normal |
| Aranha Gigante | Corte, Sangramento | Normal |
| Guardião Profano | Esmagamento, Vazio | Difícil |
| **Senhor das Fendas** | Vazio, Fogo, Gelo | **Boss** |

### Puzzles
- Expressões: 2-5 operandos, 4 operações
- Equações: ax + b = c
- Charadas: 8 charadas únicas
- Campo Minado: 4x4 a 6x6

### Tipos de Sala
- ⚔️ Combate (1-4 inimigos)
- 🧩 Puzzle (Matemática ou Charada)
- 💎 Tesouro (70% drop, 5% lendário)
- 🏨 Descanso (recupera tudo)
- 👹 Boss (final da fenda)

---

## 7. COMANDOS

```bash
# Instalar
npm install

# Jogar
npm start

# Desenvolvimento
npm run dev
```

---

## 8. ROADMAP PÓS-MVP

| Versão | Funcionalidade | Prioridade |
|--------|----------------|------------|
| 0.3    | Save/Load (JSON) | Alta |
| 0.4    | Mais tipos de inimigos | Média |
| 0.5    | Sistema de crafting | Alta |
| 0.6    | Nexus com NPCs | Média |
| 0.7    | Mais puzzles e armadilhas | Baixa |
| 0.8    | Árvores de skill | Alta |
| 0.9    | Multiplayer local | Baixa |
| 1.0    | Alpha Launch | - |

---

## 9. ARQUIVOS PRINCIPAIS

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/index.js` | Game loop, estados, inputs |
| `src/core/Dungeon.js` | Geração procedural de fendas |
| `src/core/Puzzle.js` | Puzzles matemáticos e charadas |
| `src/combat/Combat.js` | Sistema de combate, stagger, IA |
| `src/entities/Entity.js` | Classes base Player/Inimigo |
| `src/items/Item.js` | Geração de loot, consumíveis |
| `src/ui/TUI.js` | Interface terminal |

---

## 10. STATUS FINAL DESEJÁVEL

**MVP v0.0.1 - COMPLETO E JOGÁVEL**

O jogo estar totalmente funcional com:
- Loop completo de gameplay
- Combate desafiador
- Puzzles variados
- Progressão de dificuldade
- Loot recompensador
- Interface TUI polida

**Próximo marco:** Sistema de save (v0.0.2)

---

*"O caminho do Exilado é árduo, mas a recompensa é eterna."*
