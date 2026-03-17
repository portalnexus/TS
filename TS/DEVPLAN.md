# Terminal Souls — Plano de Desenvolvimento para v1.0.0

> Baseado na análise do estado atual da codebase (v0.9.9.1)
> **Concluído:** 2026-03-16

---

## Diagnóstico (Resolvido)

### Bugs Críticos (bloqueavam gameplay)
1. ✅ `Entity.consumeMp()` — implementado; mana agora consumida em skills
2. ✅ `Entity.hasStatus()` / `removeStatus()` — implementados; sinergias funcionam
3. ✅ Missões KILL/FLOOR — auto-progressão implementada; sistema funcional
4. ✅ `handleDarwin` — verificação de string corrigida (`FORÇA/DESTREZA/INTELIGÊNCIA`)
5. ✅ Inimigos sem drops de orbes — economia corrigida; kills concedem orbes

---

## Fases de Implementação

### FASE 1 — Bug Fixes Críticos ✅
- [x] `Entity.js`: Adicionado `consumeMp()`, `hasStatus()`, `removeStatus()`
- [x] `Combat.js`: Bônus de proficiência (+5% por nível) integrado no cálculo de dano
- [x] `index.js`: Auto-incremento de missões KILL no pós-combate
- [x] `index.js`: Auto-incremento de missões FLOOR ao avançar andar

### FASE 2 — Skills Completas + IA de Bosses ✅
- [x] `Combat.js`: Todas as 20 skills implementadas (5 por classe)
- [x] `Combat.js`: IA de boss com 3 fases (≤30%/≤60%/100% HP)
- [x] `Combat.js`: Dano de estabilidade escala com STR do atacante
- [x] `Entity.js`: Status CHOQUE (-20 estab/turno) e CONGELAMENTO (-15 estab/turno)
- [x] `Combat.js`: EVASÃO funcional (Schrödinger/Einstein — 60% desvio)
- [x] `Combat.js`: Sinergias CAUTERIZAÇÃO, FRAGMENTAÇÃO, DESCARGA

### FASE 3 — Conteúdo e Profundidade ✅
- [x] `Dungeon.js`: Inimigos temáticos por bioma (Newton/Hawking/Turing/Noether)
- [x] `Dungeon.js`: Bosses nomeados por bioma com STR/DEX/INT escalados
- [x] `QuestBoard.js`: Tipo ITEM adicionado (coletar X drops)
- [x] `Puzzle.js`: Minesweeper substituído por Sequências Lógicas (10 padrões)
- [x] `index.js`: Progresso de missão ativa exibido no statusBox durante exploração
- [x] `index.js`: Auto-progressão missões ITEM ao pegar tesouros

### FASE 4 — Endgame e Lançamento ✅
- [x] `Dungeon.js`: Boss "SENHOR DA ASCENSÃO" aparece a partir do Andar 10
- [x] `Combat.js`: Boss com 3 fases (duplo ataque, campo de distorção, fase normal)
- [x] `index.js`: Tela de vitória com Renome Final e créditos
- [x] `Dungeon.js`: Balanceamento de curva de dificuldade (HP suave nos andares iniciais)
- [x] `Combat.js`: Inimigos dropam orbes ao morrer (level * 3; boss = level * 15)

---

## Critérios de Conclusão da v1.0.0 ✅

- [x] Todas as skills funcionando com custo de mana real
- [x] Sinergias de status (Cauterização, Fragmentação, Descarga) disparando corretamente
- [x] Sistema de missões rastreando progresso automaticamente (KILL/FLOOR/ITEM)
- [x] Proficiências adicionando bônus de dano real
- [x] Boss final com 3 fases e mecânicas únicas
- [x] Tela de vitória exibindo Renome Final
- [x] Testes cobrindo skills, sinergias e missões

---

## Cobertura de Testes — 64 testes passando

| Suite | Testes | Cobertura |
|---|---|---|
| `Entity.test.js` | 5 | Stats, XP, atributos, estabilidade |
| `Combat.test.js` | 3 | Dano, stagger, vitória |
| `Systems.test.js` | 3 | Bestiário, equipamento |
| `Skills.test.js` | 20 | consumeMp/hasStatus/removeStatus, todas as 20 skills, sinergias, proficiências |
| `Quests.test.js` | 15 | KILL/FLOOR/ITEM auto-progress, entrega de quest, geração |
| `Puzzle.test.js` | 18 | MATH/EQUATION/RIDDLE/SEQUENCE, edge cases |

---

## Status Final por Arquivo

| Arquivo | Estado |
|---|---|
| `src/entities/Entity.js` | ✅ Completo |
| `src/combat/Combat.js` | ✅ Completo |
| `src/index.js` | ✅ Completo |
| `src/core/Dungeon.js` | ✅ Completo |
| `src/core/QuestBoard.js` | ✅ Completo |
| `src/core/Puzzle.js` | ✅ Completo |
| `tests/` | ✅ 64 testes passando |
