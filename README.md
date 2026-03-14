# Terminal Souls

**Terminal Souls** é um TUI-ARPG (RPG de Ação com Interface de Texto) inspirado em Dark Souls e Path of Exile. Experiencie uma interface de terminal minimalista que serve como uma janela para sistemas matemáticos e lógicos profundos.

## Status Atual
**Versão v0.8.0 - A Ascensão do Exilado**
*O loop de gameplay está completo. De um simples combate a um mundo vivo.*

## Recursos Principais

### 🏛️ Nexus & Economia
- **Blacksmith (Ferreiro):** Halthor agora compra loot e vende estoque rotativo.
- **Altar de Crafting:** Implementado o Reroll de atributos para itens Raros e Lendários.
- **Quadro de Missões:** Sistema de quests procedurais (Abates e Exploração) com recompensas.
- **Economia de Orbes:** Introduzida a moeda oficial para trade e serviços.

### ⚔️ Combate & RPG
- **Atributos Nucleares:** Sistema de Força (STR), Destreza (DEX) e Inteligência (INT) com Level Up.
- **Árvore de Proficiências:** Mestria em Tags (Corte, Fogo, etc.) que concede bônus de dano.
- **Reações Elementais:** Tags agora causam efeitos de status (Sangramento, Combustão, Choque).
- **IA de Combate:** Inimigos agora sofrem e causam status elementais.

### 🌍 Mundo & Exploração
- **Biomas Procedurais:** Fendas agora possuem temas (Gelo, Vazio, Fogo) com cores dinâmicas.
- **Descida Infinita:** Derrotar o Boss do andar permite descer para o próximo nível sem retornar ao Nexus.
- **Boss de Ascensão:** Novo boss final no Andar 10 (Senhor da Ascensão).

### 💾 Sistema de Almas
- **Persistência Completa:** Inventário, Orbes, Missões Ativas e Proficiências são salvos localmente em JSON.

## Arquitetura Técnica
- **Runtime:** Node.js (v18+)
- **Interface:** `blessed` (Layout e Input), `chalk` (Cores/Estética).
- **Lógica de Dados:** `uuid` (IDs únicos de itens), `mathjs` (Geração de Puzzles).
