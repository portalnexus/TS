# Terminal Souls — Plano de Desenvolvimento para v1.0.0

> Baseado na análise do estado atual da codebase (v0.9.9.1)

---

## Diagnóstico

### Bugs Críticos (bloqueiam gameplay)
1. `Entity.consumeMp()` — inexistente; mana nunca é consumida em skills
2. `Entity.hasStatus()` / `removeStatus()` — inexistentes; sinergias de status nunca disparam
3. Missões KILL/FLOOR — progresso nunca auto-incrementa; sistema inútil

### Sistemas Incompletos
4. Proficiências — definidas na Entity mas nunca aplicadas no dano (Combat.js)
5. Skills — apenas 4 de 20 implementadas em `executeSkill()`
6. IA inimiga — apenas ataque básico; bosses sem mecânicas únicas
7. Puzzle Minesweeper — placeholder, retorna string não funcional

### Endgame Faltando
8. Boss Final "O Arquiteto do Exílio" (Andar 100) sem mecânicas
9. Sem tela de vitória / créditos
10. Biomas sem inimigos temáticos próprios

---

## Fases de Implementação

### FASE 1 — Bug Fixes Críticos ✅ (Prioridade Máxima)
- [ ] `Entity.js`: Adicionar `consumeMp()`, `hasStatus()`, `removeStatus()`
- [ ] `Combat.js`: Integrar bônus de proficiência no cálculo de dano
- [ ] `index.js`: Auto-incrementar progresso de missões KILL no pós-combate
- [ ] `index.js`: Auto-incrementar progresso de missões FLOOR ao avançar andar

### FASE 2 — Skills Completas + IA de Bosses
- [ ] `Combat.js`: Implementar todas as 20 skills (5 por classe)
- [ ] `Combat.js`: IA de boss com padrões de ataque especiais
- [ ] `Combat.js`: Escalar dano de estabilidade com atributos do atacante
- [ ] `Entity.js`: Status CHOQUE (paralisa 1 turno) e CONGELAMENTO (reduz estabilidade)

### FASE 3 — Conteúdo e Profundidade
- [ ] `Dungeon.js`: Listas de inimigos por bioma (Newton/Hawking/Turing/Noether)
- [ ] `QuestBoard.js`: Novo tipo ITEM (coletar X drops)
- [ ] `Puzzle.js`: Substituir Minesweeper por Sequência de Fibonacci / padrão lógico
- [ ] `index.js`: Mostrar progresso da missão ativa durante exploração (statusBox)

### FASE 4 — Endgame e Lançamento
- [ ] `Dungeon.js`: Boss final único no Andar 10 com mecânicas especiais (testável)
- [ ] `Combat.js`: Fases do boss final (3 fases: 100%/60%/30% HP)
- [ ] `index.js`: Tela de vitória com Renome final e créditos
- [ ] Balanceamento geral da curva de dificuldade

---

## Status por Arquivo

| Arquivo | Estado | Prioridade |
|---|---|---|
| `src/entities/Entity.js` | Métodos faltando | CRÍTICO |
| `src/combat/Combat.js` | Skills incompletas, sem proficiências | ALTO |
| `src/index.js` | Quest progress, tela vitória | ALTO |
| `src/core/Dungeon.js` | Biomas sem temas, boss sem mecânica | MÉDIO |
| `src/core/QuestBoard.js` | Só 2 tipos de missão | MÉDIO |
| `src/core/Puzzle.js` | Minesweeper placeholder | BAIXO |

---

## Critérios de Conclusão da v1.0.0

- [ ] Todas as skills funcionando com custo de mana real
- [ ] Sinergias de status (Cauterização, etc.) disparando corretamente
- [ ] Sistema de missões rastreando progresso automaticamente
- [ ] Proficiências adicionando bônus de dano real
- [ ] Boss final com 3 fases e mecânicas únicas
- [ ] Tela de vitória exibindo Renome Final
- [ ] Testes cobrindo skills, sinergias e missões
