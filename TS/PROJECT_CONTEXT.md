# CONTEXTO DE PROJETO: TERMINAL SOULS - THE ECHOES OF REASON

## 1. Visão Geral
**Terminal Souls** (v0.9.9.1) é um TUI-ARPG focado em estratégia científica e legado matemático.
- **Navegação:** Teclado puro (1-0, Q/E, WASD). Mouse desativado para imersão TUI.
- **Loop:** Criação -> Exploração -> Puzzles -> Loot -> Evolução via NPCs (Ada, Marie, Darwin).
- **Core:** Sistema de Estabilidade Cinética e Renome Científico (Score).

## 2. Arquitetura Técnica
- **Interatividade:** Listener global de teclas numéricas para componentes `List` focados.
- **UI:** Layout dinâmico com Status, Sinergias, Legenda, Mapa/Combate, Logs e Análise de Dados.
- **Score:** Sistema de Renome baseado em nível, atributos, itens, skills e bestiário.

## 3. Estado do Roadmap
- [x] v0.9.9.1 - Renome Científico, Orbes em Destaque, Teclado Puro.
- [ ] v1.0.0 - Boss Final (O Arquiteto), Balanceamento do Andar 100, Créditos.
- [ ] v1.1.0+ - Multiplayer Assíncrono e Hub Social (Futuro).

## 4. Instruções para Retomada
O sistema de combate em `src/combat/Combat.js` utiliza `target.hasStatus`. A navegação 1-0 é tratada no fim de `src/index.js` e redireciona para a lista focada. O Prestígio é calculado em `src/entities/Entity.js`.
