# 📜 PATCH NOTES - TERMINAL SOULS

Acompanhe a evolução do Exílio.

---

## [v0.0.1c] - O Despertar Visual (Atual)
*A interface e a jogabilidade atingiram um novo patamar de polimento.*

### 🎨 Visual & Imersão
- **Sprites Gigantes:** Todos os inimigos e o jogador agora possuem artes ASCII de 6-8 linhas para maior impacto visual nas batalhas.
- **Paper Doll (Equipamento Visual):** Adicionada interface que mostra visualmente o que o jogador está vestindo/empunhando.
- **Mapa de Alto Contraste:** Paredes agora usam blocos sólidos (`bgWhite`) para legibilidade perfeita. O chão foi suavizado para reduzir ruído visual.

### ⚔️ Jogabilidade & Balanceamento
- **Sistema de Inventário:** Agora é possível abrir o inventário (`I`), visualizar detalhes técnicos de cada item e **Equipar/Usar** itens para ganhar bônus de status.
- **Curva de Dificuldade Suavizada:** Inimigos iniciais tiveram HP e Dano reduzidos drasticamente para permitir uma progressão justa.
- **Hotkeys de Combate:** Adicionados atalhos (`1`, `Z`, `2`, `X`) para realizar ações sem navegar em menus.
- **Controle Refinado:** Movimentação fixada em WASD; as setas agora servem exclusivamente para navegação em listas.
- **Hotkey Global:** Tecla `Espaço` agora funciona como seleção em todos os menus.

---

## [v0.0.1b] - A Fenda Aberta
*Transição do combate textual para a exploração de mapa.*

- **Mapa 2D Procedural:** Implementado o grid de navegação em tempo real.
- **Sprites ASCII:** Primeira versão dos sprites para criaturas e objetos.
- **Interação de Tiles:** Sistema para detectar tesouros, inimigos e puzzles ao caminhar.

---

## [v0.0.1a] - O Primeiro Exílio (MVP)
*Nascimento dos sistemas fundamentais.*

- **Motor de Combate:** Sistema de Postura (Stagger) e recursos (Stamina/Mana).
- **Gerador de Loot:** Criação de itens com raridades e afixos aleatórios.
- **Enigmas do Exílio:** Implementação de puzzles matemáticos e charadas.
- **Arquitetura Base:** Integração entre Node.js, Blessed e Chalk.

---
*"O caminho é longo, mas os sprites são grandes."*
