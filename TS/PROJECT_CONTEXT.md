# CONTEXTO DE PROJETO: TERMINAL SOULS

Este arquivo serve como memória técnica para retomar o desenvolvimento do **Terminal Souls**.

## 1. Visão Geral
**Terminal Souls** é um TUI-ARPG inspirado em Dark Souls e Path of Exile.
- **Estética:** Retro-terminal com sprites ASCII gigantes e cores via Chalk.
- **Loop:** Exploração de mapa 2D -> Combate por turnos / Puzzles -> Loot -> Equipamento/Progressão.

---

## 2. Arquitetura Técnica
- **Runtime:** Node.js (v18+)
- **Interface:** `blessed` (Layout e Input), `chalk` (Cores/Estética).
- **Lógica de Dados:** `uuid` (IDs únicos de itens), `mathjs` (Geração de Puzzles).

### Estrutura de Arquivos:
- `src/index.js`: Ponto de entrada, gerenciamento de estados (`MENU`, `EXPLORING`, `COMBAT`, `PUZZLE`, `INVENTORY`) e renderização da UI.
- `src/entities/Entity.js`: Lógica de atributos, cálculo de dano, sistema de Postura (Stagger), Exaustão e gerenciamento de Inventário/Equipamento.
- `src/core/Dungeon.js`: Gerador procedural de mapas 2D (Grid), posicionamento de objetos e escalonamento de dificuldade por andar.
- `src/core/Puzzle.js`: Gerador de desafios matemáticos e charadas.
- `src/combat/Combat.js`: Motor de combate por turnos com modificadores de postura e status.
- `src/items/Item.js`: Sistema de raridade (Comum -> Lendário), geração de afixos aleatórios e tags de sinergia.
- `src/ui/Sprites.js`: Biblioteca de artes ASCII gigantes e ícones do mapa.

---

## 3. Mecânicas Core (Status Atual)
- **Combate:** Sistema de Postura (Attack, Balanced, Defence) funcional. Dano crítico ao quebrar postura (Stagger).
- **Mapa:** Navegação WASD funcional com colisão e interação automática com tiles.
- **Inventário:** Interface dedicada (tecla 'I') com sistema de Equipar/Usar funcional que altera status em tempo real.
- **Dificuldade:** Progressão linear suave (Andar 1 é acessível, escala gradualmente).

---

## 4. Pendências e Roadmap
- [ ] **v0.0.2 - Persistência:** Implementar `SaveSystem.js` para salvar/carregar progresso via JSON.
- [ ] **v0.1.0 - Progressão:** Sistema de Level Up com atributos distribuíveis (Força, Destreza, Inteligência).
- [ ] **v0.2.0 - NPCs & Nexus:** Implementar o hub social com NPCs para Trade e Crafting.
- [ ] **v0.3.0 - Sinergias:** Implementar triggers de Tags (ex: Fogo + Óleo = Explosão).

---

## 5. Hotkeys Rápidas
- **WASD:** Movimentação no Mapa.
- **Espaço / Enter:** Seleção nos Menus.
- **I:** Abrir/Fechar Inventário.
- **1 / Z:** Atalho para Ataque no combate.
- **2 / X:** Atalho para Magia no combate.
- **ESC / Q:** Voltar / Sair.
